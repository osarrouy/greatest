// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";


contract Greatest is ERC721Enumerable {
    address private constant _creator = 0x62991A1B4187481C8B5BB49Fa567711e09fF488D;
    string private constant _uri = "ipfs://Qm...";

    constructor() ERC721("G500", "The 500 Greatest") {
        // that's it
    }

    function _baseURI() internal pure override returns (string memory) {
        return _uri;
    }

    function mint() external {
      uint256 supply = totalSupply();
      require(supply < 500, "Greatest: well tried, friend");
      uint256 max = supply == 0 ? 250 : 500;

      for (uint256 i = supply + 1 ; i <= max; i++) {
        _mint(_creator, i);
      }
    }
}
