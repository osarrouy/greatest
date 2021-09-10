const { expect } = require("chai");

const creator = "0x8873b045d40A458e46E356a96279aE1820a898bA";
const name = "500GreatestSongs";
const symbol = "GSAT";

describe("Greeter", () => {
  describe("# constructor", () => {
    before(async () => {
      [this.owner, this.proxy, this.recipient, this.other] = await ethers.getSigners();
      const GSAT = await ethers.getContractFactory("GSAT");
      const Registry = await ethers.getContractFactory("ProxyRegistry");
      // deploy registry
      this.registry = await Registry.deploy(this.proxy.address);
      await this.registry.deployed();
      // deploy ERC721
      this.gsat = await GSAT.deploy(this.registry.address);
      await this.gsat.deployed();
    });

    it("it sets contract owner", async () => {
      expect(await this.gsat.owner()).to.equal(this.owner.address);
    });

    // it("it mints exactly 500 tokens", async () => {
    //   expect(await this.greatest.totalSupply()).to.equal(500);
    // });

    // it("it grants 'creator' ownership over those tokens", async () => {
    //   expect(await this.greatest.ownerOf(0)).to.equal(creator);
    //   expect(await this.greatest.ownerOf(499)).to.equal(creator);
    // });

    it("it sets contract name", async () => {
      expect(await this.gsat.name()).to.equal(name);
    });

    it("it sets contract symbol", async () => {
      expect(await this.gsat.symbol()).to.equal(symbol);
    });

    // it("it leaves token #0 and #501 unminted", async () => {
    //   await expect(this.greatest.ownerOf(0)).to.be.revertedWith("ERC721: owner query for nonexistent token");
    //   await expect(this.greatest.ownerOf(501)).to.be.revertedWith("ERC721: owner query for nonexistent token");
    // });

    // it("it returns the right URI for the minted tokens", async () => {
    //   const baseURI = await this.greatest.baseURI();
    //   expect(await this.greatest.tokenURI(0)).to.equal(baseURI + "0");
    //   expect(await this.greatest.tokenURI(499)).to.equal(baseURI + "499");
    // });

    // it("it returns no URI for tokens #500", async () => {
    //   await expect(this.greatest.tokenURI(500)).to.be.revertedWith("ERC721Metadata: URI query for nonexistent token");
    // });

    // describe("» all tokens have already been minted", () => {
    //   it("it cannot be called when all the tokens are already minted", async () => {
    //     await expect(this.greatest.mint()).to.be.revertedWith("Greatest: well tried, friend");
    //   });
    // });
  });

  describe("# numOptions", () => {
    it("it returns '500'", async () => {
      expect(await this.gsat.numOptions()).to.equal(500);
    });
  });

  describe("# canMint", () => {
    describe("» option / token id is within the [0 - 499] range", () => {
      describe("» and token has not been minted yet", () => {
        it("it returns true", async () => {
          expect(await this.gsat.canMint(0)).to.equal(true);
          expect(await this.gsat.canMint(499)).to.equal(true);
        });
      });

      describe("» but token has already been minted", () => {
        before(async () => {
          this.tx = await this.gsat.connect(this.proxy).mint(0, this.recipient.address);
          this.receipt = this.tx.wait();
        });

        it("it returns false", async () => {
          expect(await this.gsat.canMint(0)).to.equal(false);
        });
      });
    });

    describe("» option / token id is out of the [0 - 499] range", () => {
      it("it returns false", async () => {
        expect(await this.gsat.canMint(500)).to.equal(false);
      });
    });
  });

  describe("# tokenURI", () => {
    describe("» token id is within the [0 - 499] range", () => {
      it("it returns the right URI", async () => {
        const baseURI = await this.gsat.baseURI();
        expect(await this.gsat.tokenURI(0)).to.equal(baseURI + "0");
        expect(await this.gsat.tokenURI(499)).to.equal(baseURI + "499");
      });
    });

    describe("» option / token id is out of the [0 - 499] range", () => {
      it("it reverts", async () => {
        await expect(this.gsat.tokenURI(500)).to.be.revertedWith("ERC721Metadata: URI query for nonexistent token");
      });
    });
  });

  describe("# supportsFactoryInterface", () => {
    it("it returns true", async () => {
      expect(await this.gsat.supportsFactoryInterface()).to.equal(true);
    });
  });

  describe("# mint", () => {
    describe("» option / token id is within the [0 - 499] range", () => {
      describe("» and token has not been minted yet", () => {
        describe("» and caller is owner's proxy", () => {
          before(async () => {
            this.tx = await this.gsat.connect(this.proxy).mint(1, this.recipient.address);
            this.receipt = this.tx.wait();
          });

          it("it mints token", async () => {
            expect(await this.gsat.ownerOf(1)).to.equal(this.recipient.address);
          });
        });

        describe("» and caller is owner", () => {
          before(async () => {
            this.tx = await this.gsat.connect(this.owner).mint(2, this.recipient.address);
            this.receipt = this.tx.wait();
          });

          it("it mints token", async () => {
            expect(await this.gsat.ownerOf(2)).to.equal(this.recipient.address);
          });
        });

        describe("» but caller is neither owner's proxy nor owner", () => {
          it("it reverts", async () => {
            await expect(this.gsat.connect(this.other).mint(2, this.recipient.address)).to.be.revertedWith("GSAT: must be owner's proxy or owner to mint");
          });
        });
      });

      describe("» but token has already been minted", () => {
        it("it reverts", async () => {
          await expect(this.gsat.connect(this.owner).mint(0, this.recipient.address)).to.be.revertedWith("GSAT: unavailable token");
        });
      });
    });

    describe("» but option / token id is out of the [0 - 499] range", () => {
      it("it reverts", async () => {
        await expect(this.gsat.connect(this.owner).mint(500, this.recipient.address)).to.be.revertedWith("GSAT: unavailable token");
      });
    });
  });
});
