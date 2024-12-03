import { readFileSync, writeFileSync } from "fs";

export const readJSON = (filePath: string) => {
  return JSON.parse(readFileSync(filePath, "utf-8"));
};

export const writeJSON = (filePath: string, data: object) => {
  writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
};
