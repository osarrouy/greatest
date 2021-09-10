// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract GSAT is Context, Ownable, ERC721("500GreatestSongs", "GSAT") {
    using Strings for uint256;

    uint256 public constant cap = 3;

    // address private constant _creator = 0x8873b045d40A458e46E356a96279aE1820a898bA;

    function mint(address to, uint256 tokenId) external {
        require(_msgSender() == owner(), "GSAT: must be owner to mint");

        _safeMint(to, tokenId);
    }

    function canMint(uint256 tokenId) public view returns (bool) {
        if (tokenId >= cap) return false;
        if (_exists(tokenId)) return false;

        return true;
    }

    function baseTokenURI() public pure returns (string memory) {
        return baseURI();
    }

    function baseURI() public pure returns (string memory) {
        return _baseURI();
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmUq5anWNehvnDoeLuJjLebhwjko1TcSjwLsF75eCtWoPh/";
    }

    // function mint() external {
    //     uint256 supply = totalSupply();
    //     require(supply < 500, "Greatest: well tried, friend");
    //     uint256 max = supply == 0 ? 250 : 500;

    //     for (uint256 i = supply + 1; i <= max; i++) {
    //         _mint(_creator, i);
    //     }
    // }

    // Moi : 0-69, 300-319
    // Toi : 70-79, 100-109, 150-159, 200-219 (j'ai un peu plus espacé si ça te va)
    // Alex : 115-119
}
