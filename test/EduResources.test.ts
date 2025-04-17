import { ethers } from "hardhat";
import { parseEther, keccak256, toUtf8Bytes } from "ethers"; // ✅ V6 style
import { expect } from "chai";

describe("EduResources", function () {
  let eduResources: any;
  let owner: any, editor: any, user: any;

  beforeEach(async () => {
    [owner, editor, user] = await ethers.getSigners();
    const EduResources = await ethers.getContractFactory("EduResources");
    eduResources = await EduResources.deploy(); // ✅ No .deployed() en Ethers v6
  });

  it("should mint initial supply to owner", async () => {
    const balance = await eduResources.balanceOf(owner.address);
    expect(balance).to.equal(parseEther("1000000")); // ✅ v6: usar parseEther directamente
  });

  it("should allow owner to assign editor", async () => {
    await eduResources.setEditor(editor.address, true);
    expect(await eduResources.isEditor(editor.address)).to.be.true;
  });

  it("should not allow non-owner to assign editor", async () => {
    await expect(
      eduResources.connect(editor).setEditor(user.address, true)
    ).to.be.reverted; // ✅ mensaje omitido por custom error
  });

  it("should allow editor to add a resource", async () => {
    await eduResources.setEditor(editor.address, true);

    const tx = await eduResources.connect(editor).addResource(
      "Curso Solidity",
      "https://link.com",
      keccak256(toUtf8Bytes("hash1")) // ✅ v6: así se hace el hash
    );

    await expect(tx).to.emit(eduResources, "ResourceAdded");
    expect(await eduResources.getResourcesCount()).to.equal(1);
  });

  it("should not allow non-editor to add a resource", async () => {
    await expect(
      eduResources.connect(user).addResource(
        "Curso JS",
        "https://js.com",
        keccak256(toUtf8Bytes("hash2"))
      )
    ).to.be.revertedWith("Only authorized editors can call this function.");
  });

  it("should allow user to upvote a resource and distribute rewards", async () => {
    await eduResources.setEditor(editor.address, true);
    await eduResources.connect(editor).addResource(
      "Curso React",
      "https://react.com",
      keccak256(toUtf8Bytes("hash3"))
    );

    const initialUserBalance = await eduResources.balanceOf(user.address);
    const initialEditorBalance = await eduResources.balanceOf(editor.address);

    const tx = await eduResources.connect(user).upvoteResource(0);
    await expect(tx).to.emit(eduResources, "ResourceUpvoted");

    const resource = await eduResources.getResource(0);
    expect(resource.upvotes).to.equal(1);

    const newUserBalance = await eduResources.balanceOf(user.address);
    const newEditorBalance = await eduResources.balanceOf(editor.address);

    expect(newUserBalance).to.equal(initialUserBalance + parseEther("5"));
    expect(newEditorBalance).to.equal(initialEditorBalance + parseEther("10"));
  });

  it("should not allow creator to upvote own resource", async () => {
    await eduResources.setEditor(editor.address, true);
    await eduResources.connect(editor).addResource(
      "Curso Web3",
      "https://web3.com",
      keccak256(toUtf8Bytes("hash4"))
    );

    await expect(
      eduResources.connect(editor).upvoteResource(0)
    ).to.be.revertedWith("You cannot upvote your own resource.");
  });

  it("should revert if upvoting a non-existing resource", async () => {
    await expect(
      eduResources.connect(user).upvoteResource(99)
    ).to.be.revertedWith("Resource does not exist.");
  });
});
