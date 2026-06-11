import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export async function runCommand(
  command: string,
  args: string[],
  cwd: string,
  timeout = 120_000,
) {
  const { stdout, stderr } = await execFileAsync(command, args, {
    cwd,
    timeout,
    maxBuffer: 1024 * 1024 * 10,
  });

  return {
    stdout,
    stderr,
  };
}