// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EduResources is Ownable, ERC20("EduResources", "EDU") {
    struct Resource{
        string description;
        string resourceLink;
        uint256 timestamp;
        bytes32 contentHash;
        address addedBy;
        uint256 upvotes;
        }
    Resource[] public resources;
    mapping (address => bool) public isEditor;

    event ResourceAdded(uint256 indexed resourceId, address indexed addedBy);
    event ResourceUpvoted(uint256 indexed resourceId, address indexed voter);
    event editorUpdate(address indexed editor, bool isAuthorized);

    constructor() {
        _mint(msg.sender, 1000000 * 10 ** decimals()); 
        }    // Mint initial supply to the contract deployer

    modifier onlyEditor() {
        require(isEditor[msg.sender], "Only authorized editors can call this function.");
        _;
        
    }

    function setEditor(address _editor, bool _isAuthorized) public onlyOwner {
        isEditor[_editor] = _isAuthorized;
        emit editorUpdate(_editor, _isAuthorized);
    }

    function addResource(string memory _description, string memory _resourceLink,  bytes32 _contentHas) external onlyEditor {
        resources.push(Resource({
            description: _description,
            resourceLink: _resourceLink,
            timestamp: block.timestamp,
            contentHash: _contentHas,
            addedBy: msg.sender,
            upvotes: 0
        }));        
        emit ResourceAdded(resources.length - 1, msg.sender);}

    function upvoteResource(uint256 _resourceId) external {
        require(_resourceId < resources.length, "Resource does not exist.");
        require(msg.sender != resources[_resourceId].addedBy, "You cannot upvote your own resource.");
        resources[_resourceId].upvotes += 1;
        _mint(msg.sender, 5 * 10 ** decimals()); // Mint 10 EDU tokens to the voter
        _mint(resources[_resourceId].addedBy, 10 * 10 ** decimals());// ← recompensa al creador
        emit ResourceUpvoted(_resourceId, msg.sender);
    }

    function getResource(uint256 _resourceId) external view returns (Resource memory) {
        require(_resourceId < resources.length, "Resource does not exist.");
        return resources[_resourceId];}

    function getResourcesCount() external view returns (uint256) {
        return resources.length;}
        
}}

    
   
