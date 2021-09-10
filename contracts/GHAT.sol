// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./interfaces/IFactoryERC721.sol";
import "./interfaces/IProxyRegistry.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract GSAT is Context, Ownable, ERC721("500GreatestSongs", "GSAT"), IFactoryERC721 {
    using Strings for uint256;

    // address private constant _creator = 0x8873b045d40A458e46E356a96279aE1820a898bA;
    IProxyRegistry public registry;

    constructor(IProxyRegistry _registry) {
        registry = _registry; // we do not check registry address to save gas
    }

    function name() public view override(ERC721, IFactoryERC721) returns (string memory) {
        return ERC721.name();
    }

    function symbol() public view override(ERC721, IFactoryERC721) returns (string memory) {
        return ERC721.symbol();
    }

    function supportsFactoryInterface() public pure override returns (bool) {
        return true;
    }

    function numOptions() public pure override returns (uint256) {
        return uint256(500);
    }

    function canMint(uint256 _optionId) public view override returns (bool) {
        if (_optionId >= numOptions()) return false;
        if (_exists(_optionId)) return false;

        return true;
    }

    function tokenURI(uint256 tokenId) public pure override(ERC721, IFactoryERC721) returns (string memory) {
        require(tokenId < 500, "ERC721Metadata: URI query for nonexistent token");

        return string(abi.encodePacked(_baseURI(), tokenId.toString()));
    }

    function mint(uint256 _optionId, address _toAddress) external override {
        address sender = _msgSender();
        address owner = owner();

        require(sender == registry.proxies(owner) || sender == owner, "GSAT: must be owner's proxy or owner to mint");
        require(canMint(_optionId), "GSAT: unavailable token");

        _safeMint(_toAddress, _optionId);
    }

    function baseTokenURI() public pure returns (string memory) {
        return "https://creatures-api.opensea.io/api/creature/";
    }

    function baseURI() public pure returns (string memory) {
        return _baseURI();
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmP7aqUthvp4PWyEnDYgdijw1CY3RtYnd98BT1Gpm4wXp4/";
    }

    // function mint() external {
    //     uint256 supply = totalSupply();
    //     require(supply < 500, "Greatest: well tried, friend");
    //     uint256 max = supply == 0 ? 250 : 500;

    //     for (uint256 i = supply + 1; i <= max; i++) {
    //         _mint(_creator, i);
    //     }
    // }
}
