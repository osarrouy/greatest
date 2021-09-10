// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IProxyRegistry {
    function proxies(address accounts) external view returns (address);
}
