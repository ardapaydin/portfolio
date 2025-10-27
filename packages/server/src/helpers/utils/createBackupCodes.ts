export default function createBackupCodes() {
  const codes = [];
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < 6; i++) {
    let code = "";
    for (let j = 0; j < 12; j++)
      code += chars[Math.floor(Math.random() * chars.length)];
    code = `${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8, 12)}`;
    codes.push(code);
  }

  return codes;
}
