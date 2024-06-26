const path = require("path");
const fs = require("fs");
const { getType } = require("mime");
const { User } = require("../../models/user");
const { normalizePath, isWithin } = require(".");
const { Workspace } = require("../../models/workspace");

function fetchPfp(pfpPath) {
  if (!fs.existsSync(pfpPath)) {
    return {
      found: false,
      buffer: null,
      size: 0,
      mime: "none/none",
    };
  }

  const mime = getType(pfpPath);
  const buffer = fs.readFileSync(pfpPath);
  return {
    found: true,
    buffer,
    size: buffer.length,
    mime,
  };
}

async function determinePfpFilepath(id) {
  const numberId = Number(id);
  const user = await User.get({ id: numberId });
  const pfpFilename = user?.pfpFilename || null;
  if (!pfpFilename) return null;

  const basePath = process.env.STORAGE_DIR
    ? path.join(process.env.STORAGE_DIR, "assets/pfp")
    : path.join(__dirname, "../../storage/assets/pfp");
  const pfpFilepath = path.join(basePath, normalizePath(pfpFilename));

  if (!isWithin(path.resolve(basePath), path.resolve(pfpFilepath))) return null;
  if (!fs.existsSync(pfpFilepath)) return null;
  return pfpFilepath;
}

async function determineWorkspacePfpFilepath(slug) {
  const workspace = await Workspace.get({ slug });
  const pfpFilename = workspace?.pfpFilename || null;
  if (!pfpFilename) return null;

  const basePath = process.env.STORAGE_DIR
    ? path.join(process.env.STORAGE_DIR, "assets/pfp")
    : path.join(__dirname, "../../storage/assets/pfp");
  const pfpFilepath = path.join(basePath, normalizePath(pfpFilename));

  if (!isWithin(path.resolve(basePath), path.resolve(pfpFilepath))) return null;
  if (!fs.existsSync(pfpFilepath)) return null;
  return pfpFilepath;
}

module.exports = {
  fetchPfp,
  determinePfpFilepath,
  determineWorkspacePfpFilepath,
};
