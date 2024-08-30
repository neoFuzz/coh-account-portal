/**
 * Static maps class to store and retrieve map IDs and their corresponding names.
 * 
 * @class Maps
 * @property {Object} ID - An object that stores map IDs as keys and map names as values.
 */
class Maps {
    // Define a static property
    static ID = {};

    /**
     * A static method to populate the ID property with the Map name to ID.
     */
    static generate() {
        Maps.ID[1] = 'Atlas Park';
        Maps.ID[101] = 'Atlas Park 2';
        Maps.ID[102] = 'Atlas Park 3';
        Maps.ID[103] = 'Atlas Park 4';
        Maps.ID[3] = 'Cimerora';
        Maps.ID[301] = 'Cimerora 2';
        Maps.ID[302] = 'Cimerora 3';
        Maps.ID[303] = 'Cimerora 4';
        Maps.ID[4] = 'Midnighter Club';
        Maps.ID[401] = 'Midnighter Club 2';
        Maps.ID[402] = 'Midnighter Club 3';
        Maps.ID[403] = 'Midnighter Club 4';
        Maps.ID[5] = 'Kings Row';
        Maps.ID[501] = 'Kings Row 2';
        Maps.ID[502] = 'Kings Row 3';
        Maps.ID[503] = 'Kings Row 4';
        Maps.ID[6] = 'Steel Canyon';
        Maps.ID[601] = 'Steel Canyon 2';
        Maps.ID[602] = 'Steel Canyon 3';
        Maps.ID[603] = 'Steel Canyon 4';
        Maps.ID[7] = 'Skyway City';
        Maps.ID[701] = 'Skyway City 2';
        Maps.ID[702] = 'Skyway City 3';
        Maps.ID[703] = 'Skyway City 4';
        Maps.ID[8] = 'Talos Island';
        Maps.ID[801] = 'Talos Island 2';
        Maps.ID[802] = 'Talos Island 3';
        Maps.ID[803] = 'Talos Island 4';
        Maps.ID[9] = 'Independence Port';
        Maps.ID[901] = 'Independence Port 2';
        Maps.ID[902] = 'Independence Port 3';
        Maps.ID[903] = 'Independence Port 4';
        Maps.ID[10] = "Founders' Falls";
        Maps.ID[1001] = "Founders' Falls 2";
        Maps.ID[1002] = "Founders' Falls 3";
        Maps.ID[1003] = "Founders' Falls 4";
        Maps.ID[11] = 'Brickstown';
        Maps.ID[1101] = 'Brickstown 2';
        Maps.ID[1102] = 'Brickstown 3';
        Maps.ID[1103] = 'Brickstown 4';
        Maps.ID[12] = 'Perez Park';
        Maps.ID[1201] = 'Perez Park 2';
        Maps.ID[1202] = 'Perez Park 3';
        Maps.ID[1203] = 'Perez Park 4';
        Maps.ID[13] = 'Boomtown';
        Maps.ID[1301] = 'Boomtown 2';
        Maps.ID[1302] = 'Boomtown 3';
        Maps.ID[1303] = 'Boomtown 4';
        Maps.ID[14] = 'Echo: Dark Astoria';
        Maps.ID[1401] = 'Echo: Dark Astoria 2';
        Maps.ID[1402] = 'Echo: Dark Astoria 3';
        Maps.ID[1403] = 'Echo: Dark Astoria 4';
        Maps.ID[15] = "Crey's Folly";
        Maps.ID[1501] = "Crey's Folly 2";
        Maps.ID[1502] = "Crey's Folly 3";
        Maps.ID[1503] = "Crey's Folly 4";
        Maps.ID[16] = 'Ouroboros';
        Maps.ID[1601] = 'Ouroboros 2';
        Maps.ID[1602] = 'Ouroboros 3';
        Maps.ID[1603] = 'Ouroboros 4';
        Maps.ID[18] = 'Abandoned Sewer Network';
        Maps.ID[1801] = 'Abandoned Sewer Network 2';
        Maps.ID[1802] = 'Abandoned Sewer Network 3';
        Maps.ID[1803] = 'Abandoned Sewer Network 4';
        Maps.ID[19] = 'Echo: Faultline';
        Maps.ID[1901] = 'Echo: Faultline 2';
        Maps.ID[1902] = 'Echo: Faultline 3';
        Maps.ID[1903] = 'Echo: Faultline 4';
        Maps.ID[20] = 'Terra Volta';
        Maps.ID[2001] = 'Terra Volta 2';
        Maps.ID[2002] = 'Terra Volta 3';
        Maps.ID[2003] = 'Terra Volta 4';
        Maps.ID[21] = 'Eden';
        Maps.ID[2101] = 'Eden 2';
        Maps.ID[2102] = 'Eden 3';
        Maps.ID[2103] = 'Eden 4';
        Maps.ID[22] = 'The Hive';
        Maps.ID[2201] = 'The Hive 2';
        Maps.ID[2202] = 'The Hive 3';
        Maps.ID[2203] = 'The Hive 4';
        Maps.ID[23] = 'Sewer Network';
        Maps.ID[2301] = 'Sewer Network 2';
        Maps.ID[2302] = 'Sewer Network 3';
        Maps.ID[2303] = 'Sewer Network 4';
        Maps.ID[29] = 'Galaxy City';
        Maps.ID[2901] = 'Galaxy City 2';
        Maps.ID[2902] = 'Galaxy City 3';
        Maps.ID[2903] = 'Galaxy City 4';
        Maps.ID[36] = 'Nova Praetoria';
        Maps.ID[3601] = 'Nova Praetoria 2';
        Maps.ID[3602] = 'Nova Praetoria 3';
        Maps.ID[3603] = 'Nova Praetoria 4';
        Maps.ID[37] = 'Imperial City';
        Maps.ID[3701] = 'Imperial City 2';
        Maps.ID[3702] = 'Imperial City 3';
        Maps.ID[3703] = 'Imperial City 4';
        Maps.ID[38] = 'Neutropolis';
        Maps.ID[3801] = 'Neutropolis 2';
        Maps.ID[3802] = 'Neutropolis 3';
        Maps.ID[3803] = 'Neutropolis 4';
        Maps.ID[39] = 'Underground Nova';
        Maps.ID[3901] = 'Underground Nova 2';
        Maps.ID[3902] = 'Underground Nova 3';
        Maps.ID[3903] = 'Underground Nova 4';
        Maps.ID[40] = 'Precinct Five';
        Maps.ID[4001] = 'Precinct Five 2';
        Maps.ID[4002] = 'Precinct Five 3';
        Maps.ID[4003] = 'Precinct Five 4';
        Maps.ID[41] = 'Destroyed Galaxy City';
        Maps.ID[4101] = 'Destroyed Galaxy City 2';
        Maps.ID[4102] = 'Destroyed Galaxy City 3';
        Maps.ID[4103] = 'Destroyed Galaxy City 4';
        Maps.ID[42] = 'Underground Imperial';
        Maps.ID[4201] = 'Underground Imperial 2';
        Maps.ID[4202] = 'Underground Imperial 3';
        Maps.ID[4203] = 'Underground Imperial 4';
        Maps.ID[43] = 'Dark Astoria';
        Maps.ID[4301] = 'Dark Astoria 2';
        Maps.ID[4302] = 'Dark Astoria 3';
        Maps.ID[4303] = 'Dark Astoria 4';
        Maps.ID[44] = 'Kallisti Wharf';
        Maps.ID[4401] = 'Kallisti Wharf 2';
        Maps.ID[4402] = 'Kallisti Wharf 3';
        Maps.ID[4403] = 'Kallisti Wharf 4';
        Maps.ID[49] = 'First Ward';
        Maps.ID[4901] = 'First Ward 2';
        Maps.ID[4902] = 'First Ward 3';
        Maps.ID[4903] = 'First Ward 4';
        Maps.ID[51] = 'Underground Neutropolis';
        Maps.ID[5101] = 'Underground Neutropolis 2';
        Maps.ID[5102] = 'Underground Neutropolis 3';
        Maps.ID[5103] = 'Underground Neutropolis 4';
    }
}

// Export the Maps class
module.exports = Maps;
