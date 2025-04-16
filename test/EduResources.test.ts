const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EduResources", function () {
  let EduResources, eduResources: { deployed: () => any; balanceOf: (arg0: any) => any; setEditor: (arg0: any, arg1: boolean) => any; isEditor: (arg0: any) => any; connect: (arg0: any) => { (): any; new(): any; setEditor: { (arg0: any, arg1: boolean): any; new(): any; }; addResource: { (arg0: string, arg1: string, arg2: any): any; new(): any; }; upvoteResource: { (arg0: number): any; new(): any; }; }; getResourcesCount: () => any; getResource: (arg0: number) => any; }, owner: { address: any; }, editor: { address: any; }, user: { address: any; };

  beforeEach(async () => {
    [owner, editor, user] = await ethers.getSigners();
    EduResources = await ethers.getContractFactory("EduResources");
    eduResources = await EduResources.deploy()
    
  });

  it("should mint initial supply to owner", async () => {
    const balance = await eduResources.balanceOf(owner.address);
    expect(balance).to.equal(ethers.utils.parseEther("1000000"));
  });

  it("should allow owner to assign editor", async () => {
    await eduResources.setEditor(editor.address, true);
    expect(await eduResources.isEditor(editor.address)).to.be.true;
  });

  it("should not allow non-owner to assign editor", async () => {
    await expect(
      eduResources.connect(editor).setEditor(user.address, true)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("should allow editor to add a resource", async () => {
    await eduResources.setEditor(editor.address, true);

    const tx = await eduResources.connect(editor).addResource(
      "Curso Solidity",
      "https://link.com",
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes("hash1"))
    );

    await expect(tx).to.emit(eduResources, "ResourceAdded");
    expect(await eduResources.getResourcesCount()).to.equal(1);
  });

  it("should not allow non-editor to add a resource", async () => {
    await expect(
      eduResources.connect(user).addResource(
        "Curso JS",
        "https://js.com",
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes("hash2"))
      )
    ).to.be.revertedWith("Only authorized editors can call this function.");
  });

  it("should allow user to upvote a resource and distribute rewards", async () => {
    await eduResources.setEditor(editor.address, true);
    await eduResources.connect(editor).addResource(
      "Curso React",
      "https://react.com",
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes("hash3"))
    );

    const initialUserBalance = await eduResources.balanceOf(user.address);
    const initialEditorBalance = await eduResources.balanceOf(editor.address);

    const tx = await eduResources.connect(user).upvoteResource(0);
    await expect(tx).to.emit(eduResources, "ResourceUpvoted");

    const resource = await eduResources.getResource(0);
    expect(resource.upvotes).to.equal(1);

    const newUserBalance = await eduResources.balanceOf(user.address);
    const newEditorBalance = await eduResources.balanceOf(editor.address);

    expect(newUserBalance).to.equal(initialUserBalance.add(ethers.utils.parseEther("5")));
    expect(newEditorBalance).to.equal(initialEditorBalance.add(ethers.utils.parseEther("10")));
  });

  it("should not allow creator to upvote own resource", async () => {
    await eduResources.setEditor(editor.address, true);
    await eduResources.connect(editor).addResource(
      "Curso Web3",
      "https://web3.com",
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes("hash4"))
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
