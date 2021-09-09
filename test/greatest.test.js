const { expect } = require("chai");
const { ethers } = require("hardhat");

const creator = "0x62991A1B4187481C8B5BB49Fa567711e09fF488D";
const baseURI = "ipfs://Qm...";

describe("Greeter", () => {
  describe("# mint", () => {
    describe("» tokens have not all been minted yet", () => {
      before(async () => {
        const Greatest = await ethers.getContractFactory("Greatest");
        // deploy
        this.greatest = await Greatest.deploy();
        this.greatest.deployed();
        // mint once
        const tx1 = await this.greatest.mint();
        await tx1.wait();
        // mint twice
        const tx2 = await this.greatest.mint();
        await tx2.wait();
      });

      it("it mints exactly 500 tokens", async () => {
        expect(await this.greatest.totalSupply()).to.equal(500);
      });

      it("it grants 'creator' ownership over those tokens", async () => {
        expect(await this.greatest.ownerOf(1)).to.equal(creator);
        expect(await this.greatest.ownerOf(500)).to.equal(creator);
      });

      it("it leaves token #0 and #501 unminted", async () => {
        await expect(this.greatest.ownerOf(0)).to.be.revertedWith("ERC721: owner query for nonexistent token");
        await expect(this.greatest.ownerOf(501)).to.be.revertedWith("ERC721: owner query for nonexistent token");
      });

      it("it returns the right URI for the minted tokens", async () => {
        expect(await this.greatest.tokenURI(1)).to.equal(baseURI + "1");
        expect(await this.greatest.tokenURI(500)).to.equal(baseURI + "500");
      });

      it("it returns no URI for tokens #0 and #501", async () => {
        await expect(this.greatest.tokenURI(0)).to.be.revertedWith("ERC721Metadata: URI query for nonexistent token");
        await expect(this.greatest.tokenURI(501)).to.be.revertedWith("ERC721Metadata: URI query for nonexistent token");
      });
    });

    describe("» all tokens have already been minted", () => {
      it("it cannot be called when all the tokens are already minted", async () => {
        await expect(this.greatest.mint()).to.be.revertedWith("Greatest: well tried, friend");
      });
    });
  });
});
