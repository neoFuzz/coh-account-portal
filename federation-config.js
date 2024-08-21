// This is an example file only.

// Define federation configuration
const federation = [
    {
        Name: 'Aurora Server',
        Url: 'http://10.5.0.91/City-of-Heroes-Account-Portal/public/',
        Policy: { // Policy for characters coming from 'Aurora Server'
            AllowOutgoing: false, // True to allow characters to transit from here (origin server) to 'Aurora Server' (destination server)
            AllowIncoming: false, // True to allow characters to transit from 'Aurora Server' (origin server) to here
            ForceInfluence: -1, // 0 (or any number) to force inf to that number; -1 to disable and allow whatever the character has
            ForceAccessLevel: 0, // 0 (or any number) to force access level to that number; -1 to disable and allow whatever the character has
            AllowInventory: true, // false to delete the inventory, true to allow whatever the character has
            ForceDefaultMap: true, // false to allow user to be on whatever map they were on when they transferred; true to force them to Pocket D
            DeleteOnTransfer: false, // true to require characters be deleted when transferring from origin server to here, false to leave them alone.
        },
        Crypto: { // Configure the same crypto keys with Aurora Server
            key: 'SomeKey',
            iv: 'SomeIV',
        },
    },
    {
        Name: 'City Of Heroes: Rebirth',
        Url: 'https://play.cityofheroesrebirth.com/',
        Policy: { // Policy for characters coming from 'Aurora Server'
            AllowOutgoing: true, // Allow characters to go to Rebirth
            AllowIncoming: true, // Allow Rebirth to come here
            ForceInfluence: -1, // Let them keep their inf
            ForceAccessLevel: 0, // Their GMs aren't allowed to be GMs here.
            AllowInventory: true, // Let them keep their stuff
            ForceDefaultMap: true, // Send visitors to Pocket D
            DeleteOnTransfer: false, // Don't require deletes when coming from Rebirth
        },
        Crypto: { // This server's entry on Rebirth must have the same crypto keys as below, and vice versa.
            key: 'AnotherKey',
            iv: 'AnotherIV',
        },
    },
];

// Export the federation configuration for use in other modules
module.exports = federation;