import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import remarkMdx from 'remark-mdx';
import remarkMath from 'remark-math';
import { visit } from 'unist-util-visit';

// Simple test function to extract headings from MDX
async function testExtractHeadings(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return [];
  }

  const mdxContent = fs.readFileSync(filePath, "utf8");
  const headings = [];

  try {
    const processor = remark().use(remarkMdx).use(remarkMath);
    const ast = await processor.parse(mdxContent);

    visit(ast, "heading", (node) => {
      let text = "";
      visit(node, (childNode) => {
        if (childNode.type === "text") {
          text += childNode.value;
        } else if (childNode.type === "inlineMath") {
          text += `$${childNode.value}$`;
        } else if (childNode.type === "math") {
          text += `$$${childNode.value}$$`;
        }
      });

      if (text.trim()) {
        const cleanText = text.replace(/\$\$.*?\$\$/g, '').replace(/\$.*?\$/g, '').trim();
        const id = cleanText
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        headings.push({
          id: id || "heading",
          text: text.trim(),
          level: node.depth,
        });
      }
    });

    return headings;
  } catch (error) {
    console.error(`Error parsing MDX:`, error.message);
    return [];
  }
}

(async () => {
  console.log('Testing proofs headings:');
  const proofsPath = path.join(process.cwd(), 'app/proofs/content/number-theory/infinitely-many-primes.mdx');
  const proofsHeadings = await testExtractHeadings(proofsPath);
  console.log('Proofs headings:', proofsHeadings);
  
  console.log('\nTesting problems headings:');
  const problemsPath = path.join(process.cwd(), 'app/problems/content/real-analysis/cleos-integral.mdx');
  const problemsHeadings = await testExtractHeadings(problemsPath);
  console.log('Problems headings:', problemsHeadings);
})().catch(console.error);
