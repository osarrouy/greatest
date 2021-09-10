const { expect } = require("chai");

const creator = "0x8873b045d40A458e46E356a96279aE1820a898bA";

describe("Token", () => {
  before(async () => {
    // set test data
    this.name = "500GreatestSongs";
    this.symbol = "GSAT";
    this.one = ethers.BigNumber.from("1");
    [this.owner, this.recipient, this.other] = await ethers.getSigners();
    // deploy token
    const Token = await ethers.getContractFactory("GSAT");
    this.token = await Token.deploy();
    await this.token.deployed();
    this.cap = await this.token.cap();
  });

  describe("# constructor", () => {
    it("it sets contract owner", async () => {
      expect(await this.token.owner()).to.equal(this.owner.address);
    });

    it("it sets contract name", async () => {
      expect(await this.token.name()).to.equal(this.name);
    });

    it("it sets contract symbol", async () => {
      expect(await this.token.symbol()).to.equal(this.symbol);
    });
  });

  describe("# canMint", () => {
    describe("» token id is within the cap range", () => {
      describe("» and token has not been minted yet", () => {
        it("it returns true", async () => {
          expect(await this.token.canMint(0)).to.equal(true);
          expect(await this.token.canMint(this.cap.sub(this.one))).to.equal(true);
        });
      });

      describe("» but token has already been minted", () => {
        before(async () => {
          this.tx = await this.token.connect(this.owner).mint(this.recipient.address, 0);
          this.receipt = this.tx.wait();
        });

        it("it returns false", async () => {
          expect(await this.token.canMint(0)).to.equal(false);
        });
      });
    });

    describe("» token id is out of the cap range", () => {
      it("it returns false", async () => {
        expect(await this.token.canMint(this.cap.add(this.one))).to.equal(false);
      });
    });
  });

  // describe("# tokenURI", () => {
  //   describe("» token id is within the [0 - 499] range", () => {
  //     it("it returns the right URI", async () => {
  //       const baseURI = await this.gsat.baseURI();
  //       expect(await this.gsat.tokenURI(0)).to.equal(baseURI + "0");
  //       expect(await this.gsat.tokenURI(499)).to.equal(baseURI + "499");
  //     });
  //   });

  //   describe("» option / token id is out of the [0 - 499] range", () => {
  //     it("it reverts", async () => {
  //       await expect(this.gsat.tokenURI(500)).to.be.revertedWith("ERC721Metadata: URI query for nonexistent token");
  //     });
  //   });
  // });

  // describe("# mint", () => {
  //   describe("» option / token id is within the [0 - 499] range", () => {
  //     describe("» and token has not been minted yet", () => {
  //       describe("» and caller is owner's proxy", () => {
  //         before(async () => {
  //           this.tx = await this.gsat.connect(this.proxy).mint(1, this.recipient.address);
  //           this.receipt = this.tx.wait();
  //         });

  //         it("it mints token", async () => {
  //           expect(await this.gsat.ownerOf(1)).to.equal(this.recipient.address);
  //         });
  //       });

  //       describe("» and caller is owner", () => {
  //         before(async () => {
  //           this.tx = await this.gsat.connect(this.owner).mint(2, this.recipient.address);
  //           this.receipt = this.tx.wait();
  //         });

  //         it("it mints token", async () => {
  //           expect(await this.gsat.ownerOf(2)).to.equal(this.recipient.address);
  //         });
  //       });

  //       describe("» but caller is neither owner's proxy nor owner", () => {
  //         it("it reverts", async () => {
  //           await expect(this.gsat.connect(this.other).mint(2, this.recipient.address)).to.be.revertedWith("GSAT: must be owner's proxy or owner to mint");
  //         });
  //       });
  //     });

  //     describe("» but token has already been minted", () => {
  //       it("it reverts", async () => {
  //         await expect(this.gsat.connect(this.owner).mint(0, this.recipient.address)).to.be.revertedWith("GSAT: unavailable token");
  //       });
  //     });
  //   });

  //   describe("» but option / token id is out of the [0 - 499] range", () => {
  //     it("it reverts", async () => {
  //       await expect(this.gsat.connect(this.owner).mint(500, this.recipient.address)).to.be.revertedWith("GSAT: unavailable token");
  //     });
  //   });
  // });
});
