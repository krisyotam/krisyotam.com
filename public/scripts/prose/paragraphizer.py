#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#
# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║                                                                           ║
# ║                     P A R A G R A P H I Z E R                             ║
# ║                                                                           ║
# ║       Reformatting Run-On Paragraphs via Claude Code Headless             ║
# ║                                                                           ║
# ╠═══════════════════════════════════════════════════════════════════════════╣
# ║                                                                           ║
# ║  Author:      Kris Yotam                                                  ║
# ║  License:     CC-0                                                        ║
# ║  Created:     2026-03-02                                                  ║
# ║                                                                           ║
# ║  Origin:      Gwern Branwen (2022-02-18)                                  ║
# ║               https://krisyotam.com/doc/mirrors/gwern.net/                ║
# ║                                                                           ║
# ║  Description:                                                             ║
# ║  Reformat a single run-on paragraph into multiple shorter paragraphs,     ║
# ║  split by topic. Uses Claude Code in headless mode (claude -p) with       ║
# ║  Opus 4.6 as the backing model.                                           ║
# ║                                                                           ║
# ║  Usage:                                                                   ║
# ║    echo "..." | python paragraphizer.py                                   ║
# ║    python paragraphizer.py "long paragraph text..."                       ║
# ║    python paragraphizer.py < file.txt                                     ║
# ║                                                                           ║
# ╚═══════════════════════════════════════════════════════════════════════════╝
#
# Paragraphizer attempts to reformat a single run-on paragraph into multiple shorter paragraphs,
# presumably split by topic. This is particularly useful for research paper abstracts, which are
# usually written in a sequential fashion (along the lines of 'Background / Question / Data /
# Methods / Results / Conclusion') but not always formatted in topic-separated paragraphs. A
# jargon-heavy run-on abstract can be near-impossible to skim.
# The input is required to be at least 100 characters.
# If the input is invalid; or if the output is not line-broken, is weirdly long, or appears to have mangled numbers; then we return the empty string "".
#
# Paragraphizer does this by a call to Claude Code headless mode; a simple 'rewrite this as'
# zero-shot prompt works well with instruction-following models like Opus 4.6.
#
# NOTE: The main failure mode is that it will not copy the abstract exactly, and may
# reword or expand on parts, which is highly undesirable, and would mean that it cannot be used to
# automatically reformat abstracts. (And if you aren't going to use Paragraphizer automatically, why
# bother? It doesn't take long to add linebreaks by hand.)
# That failure mode can be removed by
# simply checking that after removing the new newlines, it equals the original input (ie. the *only*
# difference is the inserted newlines). The result can still be bad but it's probably at least
# better.
# This check has been removed as of April 2023 as with more few-shots & better instruction-following, it is no longer an issue at abstract-scale. (It does remain an issue with transforming much longer texts, such as podcast transcripts.)
#
# Example:
#
# $ xclip -o
# Most deep reinforcement learning (RL) algorithms distill experience into parametric behavior policies or value functions via gradient updates. While effective, this approach has several disadvantages: (1) it is computationally expensive, (2) it can take many updates to integrate experiences into the parametric model, (3) experiences that are not fully integrated do not appropriately influence the agent's behavior, and (4) behavior is limited by the capacity of the model. In this paper we explore an alternative paradigm in which we train a network to map a dataset of past experiences to optimal behavior. Specifically, we augment an RL agent with a retrieval process (parameterized as a neural network) that has direct access to a dataset of experiences. This dataset can come from the agent's past experiences, expert demonstrations, or any other relevant source. The retrieval process is trained to retrieve information from the dataset that may be useful in the current context, to help the agent achieve its goal faster and more efficiently. We integrate our method into two different RL agents: an offline DQN agent and an online R2D2 agent. In offline multi-task problems, we show that the retrieval-augmented DQN agent avoids task interference and learns faster than the baseline DQN agent. On Atari, we show that retrieval-augmented R2D2 learns significantly faster than the baseline R2D2 agent and achieves higher scores. We run extensive ablations to measure the contributions of the components of our proposed method.
#
# $ xclip -o | python paragraphizer.py
# Most deep [reinforcement learning](https://en.wikipedia.org/wiki/Reinforcement_learning) (RL) algorithms distill experience into parametric behavior policies or value functions via gradient updates. While effective, this approach has several disadvantages: (1) it is computationally expensive, (2) it can take many updates to integrate experiences into the parametric model, (3) experiences that are not fully integrated do not appropriately influence the agent's behavior, and (4) behavior is limited by the capacity of the model.
#
# In this paper, we explore an alternative paradigm in which we train a network to map a dataset of past experiences to optimal behavior. Specifically, we augment an RL agent with a retrieval process (parameterized as a neural network) that has direct access to a dataset of experiences. This dataset can come from the agent's past experiences, expert demonstrations, or any other relevant source. The retrieval process is trained to retrieve information from the dataset that may be useful in the current context, to help the agent achieve its goal faster and more efficiently.
#
# We integrate our method into two different RL agents: an offline [DQN](https://en.wikipedia.org/wiki/Q-learning#Deep_Q-learning) agent and an online [R2D2](https://openreview.net/forum?id=r1lyTjAqYX) agent. In offline multi-task problems, we show that the retrieval-augmented DQN agent avoids task interference and learns faster than the baseline DQN agent. On [Atari](https://en.wikipedia.org/wiki/Atari), we show that retrieval-augmented R2D2 learns significantly faster than the baseline R2D2 agent and achieves higher scores.
#
# We run extensive ablations to measure the contributions of the components of our proposed method.
#
# $ echo "We run extensive ablations to measure the contributions of the components of our proposed method." | paragraphizer.py
# ""

import sys
import re
import shutil
import subprocess

# ═══════════════════════════════════════════════════════════════════════════
# DEPENDENCY CHECK
# ═══════════════════════════════════════════════════════════════════════════

def check_claude_code():
    """Verify Claude Code CLI is available on the system."""
    if shutil.which("claude") is None:
        print("Error: Claude Code is not installed or not in PATH.\n"
              "Install it via: npm install -g @anthropic-ai/claude-code\n"
              "See: https://docs.anthropic.com/en/docs/claude-code", file=sys.stderr)
        sys.exit(1)

check_claude_code()

# ═══════════════════════════════════════════════════════════════════════════
# INPUT
# ═══════════════════════════════════════════════════════════════════════════

if len(sys.argv) == 1:
    target = sys.stdin.read().strip().replace('  ', ' ')
else:
    target = sys.argv[1]

# Enforce the contract up front: input must be at least 100 chars. (There are some 3-sentences abstracts worth splitting, but below ~100 characters, you might as well just have one paragraph for compactness.)
if len(target) < 100:
    sys.stdout.write('""')
    sys.exit(0)

# ═══════════════════════════════════════════════════════════════════════════
# VALIDATION
# ═══════════════════════════════════════════════════════════════════════════

# Preserve numbers: the multiset of decimal numbers in the input must be a subset of the numbers in the output. (Prevents silent rewriting of quantities while allowing punctuation fixes and links.)
def _numbers(s: str):
    # keep simple: decimal/percent-like tokens
    return re.findall(r"\d+(?:\.\d+)?", s)

# ensure that the output isn't weirdly long: (2x chosen as a worst case assuming a lot of hyperlinks get added to a short abstract)
MAX_GROWTH = 2
def _looks_ok(original: str, candidate: str) -> bool:
    cand = candidate.strip()
    # must add at least one paragraph break
    if "\n" not in cand:
        return False
    # length blow-up guard (allow for inserted HTML)
    if len(cand) > int(len(original) * MAX_GROWTH) + 1000:
        return False
    # Numeric invariants: do not silently change numbers
    o_nums = _numbers(original)
    if not all(o in _numbers(cand) for o in o_nums):
        return False
    return True

# ═══════════════════════════════════════════════════════════════════════════
# PROMPT
# ═══════════════════════════════════════════════════════════════════════════

SYSTEM_PROMPT = "You are a helpful research assistant."

USER_PROMPT = f"""Task: reformatting abstracts.

Summary: Add linebreaks to a large runon paragraph. As well, add relevant HTML hyperlinks & formatting to text, and add newlines to split abstracts into Markdown paragraphs (one topic per paragraph.)

Task description: Please process the following abstract (between the '<abstract>' and '</abstract>' tags), by adding double-newlines to split it into paragraphs (one topic per paragraph.) The order of topics should be: 1. background/introduction; 2. methods/data/approach; 3. results/benchmarks/outputs; 4. conclusion/discussion/implications; 5. supplementary information (eg. URLs, code, websites, datasets).

Additional formatting instructions: convert to American spelling & conventions. Do not add unnecessary italics; but italicize formal species names as proper. If a new term, concept, or system is introduced by this research paper, bold the first appearance using '<strong>NAME</strong>' formatting (and ONLY the first use), and bold only the most important new term. Please also add useful hyperlinks (such as Wikipedia articles) in HTML format to technical terminology or names (but do not hyperlink obvious familiar terms like "University" or "psychology").

Do not duplicate links: include each link ONLY once; include only URLs you are sure of. Please include ONLY the resulting text with hyperlinks in your output, include ALL the original text, and include NO other conversation or comments.

If you cannot make any changes, return the empty string.

Examples:

- <abstract>Foo bar.</abstract>
""
- <abstract>""</abstract>
""
- <abstract></abstract>
""
- <abstract>In this paper, we explore an alternative paradigm in which we train a network to map a dataset of past experiences to optimal behavior.</abstract>
""
- <abstract>Previous theoretical results pertaining to meta-learning on sequences build on contrived assumptions and are somewhat convoluted. We introduce new information-theoretic tools that lead to an elegant and very general decomposition of error into 3 components: irreducible error, meta-learning error, and intra-task error. These tools unify analyses across many meta-learning challenges. To illustrate, we apply them to establish new results about in-context learning with transformers. Our theoretical results characterizes how error decays in both the number of training sequences and sequence lengths. Our results are very general; for example, they avoid contrived mixing time assumptions made by all prior results that establish decay of error with sequence length.</abstract>
Previous theoretical results pertaining to meta-learning on sequences build on contrived assumptions and are somewhat convoluted.
We introduce new information-theoretic tools that lead to an elegant and very general decomposition of error into 3 components: irreducible error, meta-learning error, and intra-task error. These tools unify analyses across many meta-learning challenges.
To illustrate, we apply them to establish new results about in-context learning with transformers. Our theoretical results characterizes how error decays in both the number of training sequences and sequence lengths.
Our results are very general; for example, they avoid contrived mixing time assumptions made by all prior results that establish decay of error with sequence length.
- <abstract>We show that state-of-the-art services for creating trusted timestamps in blockchain-based networks do not adequately allow for timestamping of web pages. They accept data by value (eg. images and text), but not by reference (eg. URIs of web pages). Also, we discuss difficulties in repeatedly generating the same cryptographic hash value of an archived web page. We then introduce several requirements to be fulfilled in order to produce repeatable hash values for archived web pages.</abstract>
We show that state-of-the-art services for creating trusted timestamps in blockchain-based networks do not adequately allow for timestamping of web pages. They accept data by value (eg. images and text), but not by reference (eg. URIs of web pages). Also, we discuss difficulties in repeatedly generating the same cryptographic hash value of an archived web page.
We then introduce several requirements to be fulfilled in order to produce repeatable hash values for archived web pages.
- <abstract>We run extensive ablations to measure the contributions of the components of our proposed method.</abstract>
""

[End of examples. Reminder: your primary task is to split into multiple logical paragraphs by topic.]

- <abstract>{target}</abstract>
"""

# ═══════════════════════════════════════════════════════════════════════════
# CLAUDE CODE HEADLESS INVOCATION
# ═══════════════════════════════════════════════════════════════════════════

# Build the full prompt combining system + user instructions.
# Claude Code headless mode (-p) accepts a single prompt string and returns the response.
# We use --model to pin Opus 4.6 for best instruction-following fidelity.
full_prompt = f"System: {SYSTEM_PROMPT}\n\n{USER_PROMPT}"

try:
    result = subprocess.run(
        ["claude", "-p", "--output-format", "text", full_prompt],
        capture_output=True,
        text=True,
        timeout=120,
    )
    if result.returncode != 0:
        print(f"Claude Code error (exit {result.returncode}): {result.stderr.strip()}", file=sys.stderr)
        sys.exit(1)
    out = result.stdout
except FileNotFoundError:
    print("Error: Claude Code is not installed or not in PATH.\n"
          "Install it via: npm install -g @anthropic-ai/claude-code\n"
          "See: https://docs.anthropic.com/en/docs/claude-code", file=sys.stderr)
    sys.exit(1)
except subprocess.TimeoutExpired:
    print("Error: Claude Code timed out after 120 seconds.", file=sys.stderr)
    sys.exit(1)

# ═══════════════════════════════════════════════════════════════════════════
# OUTPUT VALIDATION
# ═══════════════════════════════════════════════════════════════════════════

# clean any excess whitespace before/after, which is useless
out = out.replace(" \n", "\n").strip()
out2 = ""
if _looks_ok(target, out):
    out2 = out
else:
    print(f"Fatal error: check error from '_looks_ok'! Response:\n{out}", file=sys.stderr)
    sys.exit(2)
print(out2)
