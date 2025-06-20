import { A } from "./typography/a";

export function Footer() {
  return (
    <footer className="w-full py-3 flex text-xs text-center mt-3 dark:text-gray-400 text-gray-500 font-mono">
      <div className="grow text-left">
        Kris Yotam (
        <A href="https://twitter.com/krisyotam">
          @krisyotam
        </A>
        )
      </div>
      <div>
        <A href="https://github.com/krisyotam/blog">
          Source
        </A>
      </div>
    </footer>
  );
} 