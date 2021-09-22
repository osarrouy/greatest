const { expect } = require("chai");
const { holders, friends } = require("./lib");
const DropCount = 50 + 5 + 50 + 33;

const Batch = {
  Arkhe: 0,
  Drop: 1,
  A: 2,
  B: 3,
};

describe.only("Token", () => {
  before(async () => {
    // set test data
    this.name = "500GreatestSongs";
    this.symbol = "GSAT";
    this.one = ethers.BigNumber.from("1");
    this.cap = ethers.BigNumber.from("500");
    [this.owner, this.proxy, this.recipient, this.other] = await ethers.getSigners();
    // deploy registry
    const Registry = await ethers.getContractFactory("ProxyRegistry");
    this.registry = await Registry.deploy(this.proxy.address);
    await this.registry.deployed();
    // deploy token
    const Token = await ethers.getContractFactory("GSAT");
    this.token = await Token.deploy(this.registry.address);
    await this.token.deployed();

    this.david = await this.token.david();
    this.olivier = await this.token.olivier();
    this.alex = await this.token.alex();
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

    it("it pre-mints tokens [1 - 20] and [334 - 350] to David", async () => {
      for (let i = 1; i <= 20; i++) {
        expect(await this.token.ownerOf(i)).to.equal(this.david);
      }

      for (let i = 334; i < 350; i++) {
        expect(await this.token.ownerOf(i)).to.equal(this.david);
      }
    });

    it("it pre-mints tokens [71 - 80], [101 - 110], [151 - 160] and [201 - 220] to Olivier", async () => {
      for (let i = 71; i <= 80; i++) {
        expect(await this.token.ownerOf(i)).to.equal(this.olivier);
      }

      for (let i = 101; i <= 110; i++) {
        expect(await this.token.ownerOf(i)).to.equal(this.olivier);
      }

      for (let i = 151; i <= 160; i++) {
        expect(await this.token.ownerOf(i)).to.equal(this.olivier);
      }

      for (let i = 201; i <= 220; i++) {
        expect(await this.token.ownerOf(i)).to.equal(this.olivier);
      }
    });

    it("it pre-mints tokens [116 - 120] to Alex", async () => {
      for (let i = 116; i <= 120; i++) {
        expect(await this.token.ownerOf(i)).to.equal(this.alex);
      }
    });
  });

  describe("# mint", () => {
    describe("» caller is owner", () => {
      describe("» Batch.Drop", () => {
        before(async () => {
          this.tx = await this.token.mint(Batch.Drop);
          this.receipt = await this.tx.wait();
        });

        it("it pre-mints tokens [21 - 70] to holders", async () => {
          for (let i = 0; i < 50; i++) {
            expect((await this.token.ownerOf(i + 21)).toLowerCase()).to.equal(holders[i].toLowerCase());
          }
        });

        it("it pre-mints tokens [301 - 333] to friends", async () => {
          for (let i = 0; i < 33; i++) {
            expect((await this.token.ownerOf(i + 301)).toLowerCase()).to.equal(friends[i].toLowerCase());
          }
        });
      });

      describe("» Batch.A and Batch.B", () => {
        before(async () => {
          this.tx = await this.token.mint(Batch.A);
          this.receipt = await this.tx.wait();

          this.tx = await this.token.mint(Batch.B);
          this.receipt = await this.tx.wait();
        });

        it("it mints the remaining tokens", async () => {
          expect(await this.token.totalSupply()).to.equal(500);
          expect(await this.token.balanceOf(this.david)).to.equal(500 - DropCount);
        });
      });
    });

    describe("» caller is not owner", () => {
      it("it reverts", async () => {
        await expect(this.token.connect(this.other).mint(Batch.Drop)).to.be.revertedWith("GSAT: must be owner to mint");
      });
    });
  });

  // describe("# canMint", () => {
  //   describe("» token id is within the cap range", () => {
  //     describe("» and token has not been minted yet", () => {
  //       it("it returns true", async () => {
  //         expect(await this.token.canMint(80)).to.equal(true);
  //         expect(await this.token.canMint(499)).to.equal(true);
  //       });
  //     });

  //     describe("» but token has already been minted", () => {
  //       it("it returns false", async () => {
  //         // already minted through the pre-mint
  //         expect(await this.token.canMint(0)).to.equal(false);
  //       });
  //     });
  //   });

  //   describe("» token id is out of the cap range", () => {
  //     it("it returns false", async () => {
  //       expect(await this.token.canMint(501)).to.equal(false);
  //     });
  //   });
  // });

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
