function h93kim(userid, htmlId) {
    "use strict";
    var templates = {};

    window.gMapsCallback = function () {
        $(window).trigger('gMapsLoaded');
    };

    var curmap;
    var allpossibleroutes = [];
    var optimalroute = [];
    var campusRouteCoordinates = [];
    var campusRoute;
    var markers = [];
    var directionsDisplay;
    var directionsService;

    // function which, when given a string, returns the building whose 
    // code is the given string.
    function nameToObject(a) {
        switch (a) {
        case "MC":
            return mcbuilding;
        case "QNC":
            return qncbuilding;
        case "B2":
            return b2building;
        case "B1":
            return b1building;
        case "ESC":
            return escbuilding;
        case "C2":
            return c2building;
        case "DC":
            return dcbuilding;
        case "CIF":
            return cifbuilding;
        case "OPT":
            return optbuilding;
        case "BMH":
            return bmhbuilding;
        case "LHI":
            return lhibuilding;
        case "ERC":
            return ercbuilding;
        case "M3":
            return m3building;
        case "PAC":
            return pacbuilding;
        case "SLC":
            return slcbuilding;
        case "EIT":
            return eitbuilding;
        case "DC2":
            return dc2building;
        case "E3":
            return e3building;
        case "E5":
            return e5building;
        case "E2":
            return e2building;
        case "PHYS":
            return physbuilding;
        case "RCH":
            return rchbuilding;
        case "DWE":
            return dwebuilding;
        case "CPH":
            return cphbuilding;
        case "GH":
            return ghbuilding;
        case "SCH":
            return schbuilding;
        case "TC":
            return tcbuilding;
        case "AL":
            return albuilding;
        case "DP":
            return dpbuilding;
        case "ML":
            return mlbuilding;
        case "NH":
            return nhbuilding;
        case "EV1":
            return ev1building;
        case "HH":
            return hhbuilding;
        case "EV2":
            return ev2building;
        case "EV3":
            return ev3building;
        case "PAS":
            return pasbuilding;
        }
    }

    // Stores the best possible path from start to finish in optimalroute.
    function findroute(start, finish) {
        allpossibleroutes = [];
        optimalroute = [];
        findroutes(start, finish, []);
        getoptimalroute();
    }

    // Chooses the path with the smallest length of all possible paths stored in allpossibleroutes
    function getoptimalroute() {
        if (allpossibleroutes.length == 1) {
            optimalroute = allpossibleroutes[0].split(",");
        } else {
            var bestsofar = 0;
            for (var i = 1; i < allpossibleroutes.length; i++) {
                if (allpossibleroutes[i].split(",").length < allpossibleroutes[bestsofar].split(",").length) {
                    bestsofar = i;
                }
            }
            optimalroute = allpossibleroutes[bestsofar].split(",");
        }
    }

    // Depth-First Search Algorithm that finds all possible paths from start to finish
    function findroutes(start, finish, visited) {
        visited.push(start);

        var nodes = nameToObject(start).neighbours;

        for (var q in nodes) {
            if (visited.indexOf(nodes[q]) != -1) {
                continue;
            }
            if (nodes[q] == finish) {
                visited.push(nodes[q]);
                allpossibleroutes.push(visited.join());
                visited.pop();
            }
        }

        for (var q in nodes) {
            if (visited.indexOf(nodes[q]) != -1) {
                continue;
            } else if (nodes[q] == finish) {
                continue;
            } else {
                findroutes(nodes[q], finish, visited);
                visited.pop();
            }
        }
    }

    // Add a marker to the map and push to the array.
    function addMarker(x, y, thestring) {
        var image;
        if (thestring == "Destination") {
            image = "widgets/h93kim/finish.png";
        } else {
            image = "widgets/h93kim/start.png";
        }
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(x, y),
            map: curmap,
            title: thestring,
            icon: image
        });

        markers.push(marker);
    }

    // Sets the map on all markers in the array.
    function setAllMap(map) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }

    // Removes the markers from the map, but keeps them in the array.
    function clearMarkers() {
        setAllMap(null);
    }

    // Deletes all markers in the array by removing references to them.
    function deleteMarkers() {
        clearMarkers();
        markers = [];
    }

    // function which reverses the set of latLng points given by toward.
    function myreverse(x) {
        var x = x.reverse();
        for (var index = 0; index < x.length; index = index + 2) {
            var temp = x[index];
            x[index] = x[index + 1];
            x[index + 1] = temp;
        }
        return x;
    }

    // For every single building, a corresponding object was created, with
    // its name, connected neighbours, lat/longitude points for the center
    // of the building, lat/longitude points of the door for outdoor routes and
    // finally a method that returns an array of lat/longtitude points for its
    // path to the connected neighbours.

    var mcbuilding = {
        name: "Mathematics and Computer",
        neighbours: ["C2", "DC", "QNC", "M3"],
        lat: 43.472130,
        lng: -80.544001,
        doorlat: 43.471762,
        doorlng: -80.543649,
        toward: function (abuilding) {
            if (abuilding == "QNC") {
                return [43.472065, -80.544164, 43.471724, -80.543900, 43.471678, -80.544021, 43.471472, -80.543890];
            } else if (abuilding == "DC") {
                return myreverse(dcbuilding.toward("MC"));
            } else if (abuilding == "C2") {
                return [43.472223, -80.543757, 43.472052, -80.543644, 43.472161, -80.543313];
            } else if (abuilding == "M3") {
                return [43.472220, -80.543765, 43.472412, -80.543896, 43.472461, -80.543751, 43.472582, -80.543851, 43.472605, -80.543810, 43.473070, -80.544146];
            }
        }
    };

    var dcbuilding = {
        name: "William G. Davis Center",
        neighbours: ["MC", "C2", "DC2", "M3"],
        lat: 43.472759,
        lng: -80.542274,
        doorlat: 43.472759,
        doorlng: -80.542274,
        toward: function (abuilding) {
            if (abuilding == "MC") {
                return [43.472720, -80.542426, 43.473049, -80.542611, 43.472591, -80.543859, 43.472463, -80.543765, 43.472416, -80.543894, 43.472218, -80.543768];
            } else if (abuilding == "C2") {
                return [43.472710, -80.542389, 43.472486, -80.542209];
            } else if (abuilding == "DC2") {
                return [43.472835, -80.542062];
            } else if (abuilding == "M3") {
                return [43.472710, -80.542410, 43.473025, -80.542620, 43.472591, -80.543853, 43.472977, -80.544122];
            }
        }
    };

    var qncbuilding = {
        name: "Quantum Nano Center",
        neighbours: ["B2", "MC", "SLC"],
        lat: 43.471472,
        lng: -80.543890,
        doorlat: 43.471114,
        doorlng: -80.544578,
        toward: function (abuilding) {
            if (abuilding == "B2") {
                return [];
            } else if (abuilding == "MC") {
                return myreverse(mcbuilding.toward("QNC"));
            } else if (abuilding == "SLC") {
                return [43.471293, -80.544553, 43.471768, -80.544862, 43.471749, -80.545004, 43.471766, -80.545117];
            }
        }
    };

    var b2building = {
        name: "Biology 2",
        neighbours: ["QNC", "B1"],
        lat: 43.470945,
        lng: -80.543537,
        doorlat: 43.470680,
        doorlng: -80.544175,
        toward: function (abuilding) {
            if (abuilding == "QNC") {
                return [];
            } else if (abuilding == "B1") {
                return myreverse(b1building.toward("B2"));
            }
        }
    };

    var b1building = {
        name: "Biology 1",
        neighbours: ["B2", "ESC"],
        lat: 43.470984,
        lng: -80.543180,
        doorlat: 43.471056,
        doorlng: -80.542984,
        toward: function (abuilding) {
            if (abuilding == "B2") {
                return [43.470882, -80.543491];
            } else if (abuilding == "ESC") {
                return myreverse(escbuilding.toward("B1"));
            }
        }
    };

    var escbuilding = {
        name: "Earth Sciences & Chemistry",
        neighbours: ["B1", "C2", "EIT"],
        lat: 43.471174,
        lng: -80.542590,
        doorlat: 43.471505,
        doorlng: -80.543092,
        toward: function (abuilding) {
            if (abuilding == "B1") {
                return [];
            } else if (abuilding == "C2") {
                return myreverse(c2building.toward("ESC"));
            } else if (abuilding == "EIT") {
                return [];
            }
        }
    };

    var c2building = {
        name: "Chemistry 2",
        neighbours: ["ESC", "MC", "DC"],
        lat: 43.472140,
        lng: -80.543295,
        doorlat: 43.472118,
        doorlng: -80.543352,
        toward: function (abuilding) {
            if (abuilding == "ESC") {
                return [43.471941, -80.543108];
            } else if (abuilding == "MC") {
                return myreverse(mcbuilding.toward("C2"));
            } else if (abuilding == "DC") {
                return myreverse(dcbuilding.toward("C2"));
            }
        }
    };

    var cifbuilding = {
        name: "Columbia Icefield",
        neighbours: ["OPT", "BMH"],
        lat: 43.475334,
        lng: -80.548284,
        doorlat: 43.474908,
        doorlng: -80.548013,
        toward: function (abuilding) {
            if (abuilding == "OPT") {
                return [43.474910, -80.548000, 43.475071, -80.547515, 43.474931, -80.547418, 43.475017, -80.547174, 43.474873, -80.547075, 43.474808, -80.546734, 43.474736, -80.546678, 43.474847, -80.546345, 43.475165, -80.546181, 43.475239, -80.546069, 43.475458, -80.546176, 43.475641, -80.545750];
            } else if (abuilding == "BMH") {
                return [43.474910, -80.548000, 43.475073, -80.547525, 43.474933, -80.547429, 43.475009, -80.547179, 43.474878, -80.547080, 43.474814, -80.546750, 43.473927, -80.546165, 43.474104, -80.545637, 43.473880, -80.545557];
            }
        }
    };

    var optbuilding = {
        name: "School of Optometry",
        neighbours: ["CIF", "BMH"],
        lat: 43.475704,
        lng: -80.545594,
        doorlat: 43.475630,
        doorlng: -80.545734,
        toward: function (abuilding) {
            if (abuilding == "BMH") {
                return [43.475472, -80.546184, 43.475281, -80.546080, 43.475215, -80.546088, 43.475170, -80.546157, 43.474945, -80.546251, 43.474209, -80.545701, 43.473880, -80.545557];
            } else if (abuilding == "CIF") {
                return myreverse(cifbuilding.toward("OPT"));
            }
        }
    };

    var bmhbuilding = {
        name: "B.C. Matthews Hall",
        neighbours: ["CIF", "OPT", "LHI", "ERC"],
        lat: 43.473849,
        lng: -80.545224,
        doorlat: 43.473987,
        doorlng: -80.545506,
        toward: function (abuilding) {
            if (abuilding == "CIF") {
                return myreverse(cifbuilding.toward("BMH"));
            } else if (abuilding == "OPT") {
                return myreverse(optbuilding.toward("BMH"));
            } else if (abuilding == "LHI") {
                return [43.473849, -80.545224, 43.473642, -80.545329, 43.473483, -80.545774, 43.473195, -80.545642, 43.473127, -80.545811, 43.473300, -80.545935];
            } else if (abuilding == "ERC") {
                return [43.473853, -80.545205, 43.473991, -80.545050, 43.473991, -80.544975, 43.473907, -80.544776, 43.473751, -80.544688];
            }
        }
    };

    var lhibuilding = {
        name: "Lyle S. Hallman Institute",
        neighbours: ["BMH"],
        lat: 43.473261,
        lng: -80.546026,
        doorlat: 43.473113,
        doorlng: -80.545763,
        toward: function (abuilding) {
            if (abuilding == "BMH") {
                return myreverse(bmhbuilding.toward("LHI"));
            }
        }
    };

    var ercbuilding = {
        name: "Energy Research Centre",
        neighbours: ["BMH", "M3"],
        lat: 43.473607,
        lng: -80.544569,
        doorlat: 43.473781,
        doorlng: -80.544639,
        toward: function (abuilding) {
            if (abuilding == "BMH") {
                return myreverse(bmhbuilding.toward("ERC"));
            } else if (abuilding == "M3") {
                return [];
            }
        }
    };

    var m3building = {
        name: "Mathematics 3",
        neighbours: ["ERC", "MC", "DC"],
        lat: 43.473154,
        lng: -80.544258,
        doorlat: 43.472860,
        doorlng: -80.544089,
        toward: function (abuilding) {
            if (abuilding == "MC") {
                return myreverse(mcbuilding.toward("M3"));
            } else if (abuilding == "DC") {
                return myreverse(dcbuilding.toward("M3"));
            } else if (abuilding == "ERC") {
                return myreverse(ercbuilding.toward("M3"));
            }
        }
    };

    var pacbuilding = {
        name: "Physical Activities Complex",
        neighbours: ["SLC"],
        lat: 43.472303,
        lng: -80.546190,
        doorlat: 43.471867,
        doorlng: -80.546122,
        toward: function (abuilding) {
            if (abuilding == "SLC") {
                return [43.472015, -80.545967, 43.471918, -80.545479];
            }
        }
    };

    var slcbuilding = {
        name: "Student Life Centre",
        neighbours: ["PAC", "QNC"],
        lat: 43.471786,
        lng: -80.545267,
        doorlat: 43.471562,
        doorlng: -80.545278,
        toward: function (abuilding) {
            if (abuilding == "PAC") {
                return myreverse(pacbuilding.toward("SLC"));
            } else if (abuilding == "QNC") {
                return myreverse(qncbuilding.toward("SLC"));
            }
        }
    };

    var eitbuilding = {
        name: "Centre for Environmental and Information Technology",
        neighbours: ["ESC", "PHYS", "DC2"],
        lat: 43.471375,
        lng: -80.541992,
        doorlat: 43.471875,
        doorlng: -80.542247,
        toward: function (abuilding) {
            if (abuilding == "ESC") {
                return myreverse(escbuilding.toward("EIT"));
            } else if (abuilding == "PHYS") {
                return [];
            } else if (abuilding == "DC2") {
                return [43.471457, -80.541761, 43.471608, -80.541893, 43.471673, -80.541716, 43.471739, -80.541764];
            }
        }
    };

    var dc2building = {
        name: "Davis Center 2",
        neighbours: ["DC", "E3", "EIT"],
        lat: 43.471891,
        lng: -80.541375,

        toward: function (abuilding) {
            if (abuilding == "DC") {
                return myreverse(dcbuilding.toward("DC2"));
            } else if (abuilding == "E3") {
                return [43.472037, -80.540986];
            } else if (abuilding == "EIT") {
                return myreverse(eitbuilding.toward("DC2"));
            }
        }
    };

    var e3building = {
        name: "Engineering 3",
        neighbours: ["DC2", "E5", "E2"],
        lat: 43.471865,
        lng: -80.540884,
        doorlat: 43.472231,
        doorlng: -80.541254,
        toward: function (abuilding) {
            if (abuilding == "DC2") {
                return myreverse(dc2building.toward("E3"));
            } else if (abuilding == "E2") {
                return [];
            } else if (abuilding == "E5") {
                return [43.471943, -80.540594, 43.472005, -80.540533, 43.472438, -80.539878];
            }
        }
    };

    var e5building = {
        name: "Engineering 5",
        neighbours: ["E3"],
        lat: 43.472838,
        lng: -80.540161,
        doorlat: 43.472796,
        doorlng: -80.540211,
        toward: function (abuilding) {
            if (abuilding == "E3") {
                return myreverse(e3building.toward("E5"));
            }
        }
    };

    var e2building = {
        name: "Engineering 2",
        neighbours: ["E3", "PHYS", "RCH", "DWE", "CPH"],
        lat: 43.470890,
        lng: -80.540334,
        doorlat: 43.470750,
        doorlng: -80.540265,
        toward: function (abuilding) {
            if (abuilding == "PHYS") {
                return [43.470660, -80.541026, 43.470633, -80.541101, 43.470589, -80.541079, 43.470490, -80.541372];
            } else if (abuilding == "E3") {
                return [];
            } else if (abuilding == "RCH") {
                return [43.470676, -80.540973, 43.470578, -80.540915, 43.470534, -80.540932, 43.470345, -80.540810];
            } else if (abuilding == "DWE") {
                return [43.470113, -80.539752];
            } else if (abuilding == "CPH") {
                return [43.471139, -80.539658, 43.471106, -80.539642, 43.471130, -80.539524];
            }

        }
    };

    var physbuilding = {
        name: "Physics",
        neighbours: ["EIT", "E2"],
        lat: 43.470627,
        lng: -80.541480,
        doorlat: 43.470497,
        doorlng: -80.541635,
        toward: function (abuilding) {
            if (abuilding == "E2") {
                return myreverse(e2building.toward("PHYS"));
            } else if (abuilding == "EIT") {
                return myreverse(eitbuilding.toward("PHYS"));
            }
        }
    };

    var rchbuilding = {
        name: "J.R. Coutts Engineering Lecture Hall",
        neighbours: ["DWE", "E2"],
        lat: 43.470265,
        lng: -80.540841,
        doorlat: 43.470086,
        doorlng: -80.540940,
        toward: function (abuilding) {
            if (abuilding == "E2") {
                return myreverse(e2building.toward("RCH"));
            } else if (abuilding == "DWE") {
                return [];
            }
        }
    };

    var dwebuilding = {
        name: "Douglas Wright Engineering Building",
        neighbours: ["GH", "RCH", "E2", "CPH", "SCH"],
        lat: 43.469845,
        lng: -80.540554,
        doorlat: 43.470209,
        doorlng: -80.539691,
        toward: function (abuilding) {
            if (abuilding == "GH") {
                return [];
            } else if (abuilding == "RCH") {
                return [];
            } else if (abuilding == "E2") {
                return myreverse(e2building.toward("DWE"));
            } else if (abuilding == "CPH") {
                return myreverse(cphbuilding.toward("DWE"));
            } else if (abuilding == "SCH") {
                return [43.469788, -80.540651];
            }

        }
    };

    var cphbuilding = {
        name: "Carl A. Pollock Hall",
        neighbours: ["E2", "DWE"],
        lat: 43.471022,
        lng: -80.539444,
        doorlat: 43.470814,
        doorlng: -80.539385,
        toward: function (abuilding) {
            if (abuilding == "E2") {
                return myreverse(e2building.toward("CPH"));
            } else if (abuilding == "DWE") {
                return [43.470664, -80.539176, 43.470725, -80.539004, 43.470563, -80.538907, 43.470540, -80.538999, 43.470485, -80.538953, 43.470291, -80.539559, 43.470201, -80.539524];
            }

        }
    };

    var ghbuilding = {
        name: "Graduate House",
        neighbours: ["DWE"],
        lat: 43.469755,
        lng: -80.540924,
        doorlat: 43.469808,
        doorlng: -80.540780,
        toward: function (abuilding) {
            if (abuilding == "DWE") {
                return [];
            }

        }
    };

    var schbuilding = {
        name: "South Campus Hall",
        neighbours: ["DWE", "TC", "AL"],
        lat: 43.469276,
        lng: -80.540275,
        doorlat: 43.469446,
        doorlng: -80.540366,
        toward: function (abuilding) {
            if (abuilding == "DWE") {
                return [43.469788, -80.540651];
            } else if (abuilding == "TC") {
                return [43.469197, -80.540222, 43.469072, -80.540546, 43.468887, -80.541190];
            } else if (abuilding == "AL") {
                return [43.469197, -80.540222, 43.469072, -80.540546, 43.468887, -80.541190, 43.468704, -80.541721, 43.468895, -80.541863];
            }

        }
    };

    var tcbuilding = {
        name: "Tatham Center",
        neighbours: ["SCH", "AL"],
        lat: 43.469088,
        lng: -80.541324,
        doorlat: 43.468959,
        doorlng: -80.541429,
        toward: function (abuilding) {
            if (abuilding == "SCH") {
                return myreverse(schbuilding.toward("TC"));
            } else if (abuilding == "AL") {
                return [43.468887, -80.541190, 43.468704, -80.541721, 43.468895, -80.541863];
            }

        }
    };

    var albuilding = {
        name: "Arts Lecture Hall",
        neighbours: ["DP", "ML", "EV1", "TC", "SCH"],
        lat: 43.468895,
        lng: -80.541863,
        doorlat: 43.469088,
        doorlng: -80.541960,
        toward: function (abuilding) {
            if (abuilding == "SCH") {
                return myreverse(schbuilding.toward("AL"));
            } else if (abuilding == "TC") {
                return myreverse(tcbuilding.toward("AL"));
            } else if (abuilding == "DP") {
                return [];
            } else if (abuilding == "ML") {
                return [43.468669, -80.542475];
            } else if (abuilding == "EV1") {
                return [43.468669, -80.542475];
            }

        }
    };

    var dpbuilding = {
        name: "Dana Porter Library",
        neighbours: ["AL"],
        lat: 43.469666,
        lng: -80.542247,
        doorlat: 43.469494,
        doorlng: -80.542064,
        toward: function (abuilding) {
            if (abuilding == "AL") {
                return [];
            }

        }
    };

    var mlbuilding = {
        name: "Modern Languages",
        neighbours: ["NH", "EV1", "AL"],
        lat: 43.469029,
        lng: -80.542732,
        doorlat: 43.469088,
        doorlng: -80.542992,
        toward: function (abuilding) {
            if (abuilding == "EV1") {
                return [];
            } else if (abuilding == "AL") {
                return myreverse(albuilding.toward("ML"));
            } else if (abuilding == "NH") {
                return [43.469148, -80.542807, 43.469099, -80.542963, 43.469156, -80.543113, 43.469241, -80.543220, 43.469331, -80.543290, 43.469372, -80.543151, 43.469432, -80.542979, 43.469584, -80.543054, 43.469744, -80.543145, 43.469675, -80.543419];
            }

        }
    };

    var nhbuilding = {
        name: "Needles Hall",
        neighbours: ["ML"],
        lat: 43.469677,
        lng: -80.543494,
        doorlat: 43.469664,
        doorlng: -80.543837,
        toward: function (abuilding) {
            if (abuilding == "ML") {
                return myreverse(mlbuilding.toward("NH"));
            }

        }
    };

    var ev1building = {
        name: "Environment 1",
        neighbours: ["HH", "EV2", "ML", "AL"],
        lat: 43.468513,
        lng: -80.542354,
        doorlat: 43.468504,
        doorlng: -80.542539,
        toward: function (abuilding) {
            if (abuilding == "EV2") {
                return [43.468330, -80.542826, 43.468171, -80.542716];
            } else if (abuilding == "AL") {
                return myreverse(albuilding.toward("EV1"));
            } else if (abuilding == "ML") {
                return [];
            } else if (abuilding == "HH") {
                return [43.468570, -80.542252, 43.468103, -80.541933, 43.468054, -80.542083, 43.467776, -80.541877, 43.467742, -80.541836, 43.467826, -80.541565];
            }

        }
    };

    var hhbuilding = {
        name: "Hagey Hall",
        neighbours: ["EV1"],
        lat: 43.467888,
        lng: -80.541450,
        doorlat: 43.467968,
        doorlng: -80.541745,
        toward: function (abuilding) {
            if (abuilding == "EV1") {
                return myreverse(ev1building.toward("HH"));
            }
        }
    };

    var ev2building = {
        name: "Environment 2",
        neighbours: ["EV1", "EV3", "PAS"],
        lat: 43.468095,
        lng: -80.542901,
        doorlat: 43.467997,
        doorlng: -80.542834,
        toward: function (abuilding) {
            if (abuilding == "EV1") {
                return myreverse(ev1building.toward("EV2"));
            } else if (abuilding == "EV3") {
                return [43.467955, -80.543368];
            } else if (abuilding == "PAS") {
                return [];
            }
        }
    };

    var ev3building = {
        name: "Environment 3",
        neighbours: ["EV2"],
        lat: 43.468190,
        lng: -80.543499,
        doorlat: 43.468184,
        doorlng: -80.543607,
        toward: function (abuilding) {
            if (abuilding == "EV2") {
                return myreverse(ev2building.toward("EV3"));
            }
        }
    };

    var pasbuilding = {
        name: "Psychology, Anthropology & Sociology",
        neighbours: ["EV2"],
        lat: 43.467190,
        lng: -80.542370,
        doorlat: 43.467359,
        doorlng: -80.542673,
        toward: function (abuilding) {
            if (abuilding == "EV2") {
                return myreverse(ev2building.toward("PAS"));
            }
        }
    };

    //initialization of everything
    function initialize() {
        var mapOptions = {
            zoom: 16,
            center: new google.maps.LatLng(43.471675, -80.542789),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: false,
        };

        curmap = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);

        campusRoute = new google.maps.Polyline({
            path: campusRouteCoordinates,
            geodesic: true,
            strokeColor: '#66AAED',
            strokeOpacity: 1,
            strokeWeight: 5
        });

        campusRoute.setMap(curmap);

        google.maps.event.addListener(curmap, 'click', function (e) {
            console.log(e.latLng.lat().toFixed(6) + " plus " + e.latLng.lng().toFixed(6));
            $("#h93kim_lat").val(e.latLng.lat().toFixed(6));
            $("#h93kim_lng").val(e.latLng.lng().toFixed(6));
        });

        directionsService = new google.maps.DirectionsService();
        directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(curmap);

        $("#h93kim_center").click(function () {
            console.log("clicked center");
            var latCenter = document.getElementById("h93kim_lat").value;
            var lngCenter = document.getElementById("h93kim_lng").value;
            console.log("Center Changed to: " + latCenter + " " + lngCenter);
            var something = new google.maps.LatLng(latCenter, lngCenter, true);
            curmap.setCenter(something);

        });

        function printroute(start, finish) {
            findroute(start, finish);
            campusRoute.setPath([new google.maps.LatLng(nameToObject(start).lat, nameToObject(start).lng)]);
            var curpath = campusRoute.getPath();
            for (var x = 1; x < optimalroute.length; x++) {
                var toadd = nameToObject(optimalroute[x - 1]).toward(optimalroute[x]);
                curpath.push(new google.maps.LatLng(nameToObject(optimalroute[x - 1]).lat, nameToObject(optimalroute[x - 1]).lng));
                for (var y = 0; y < toadd.length; y = y + 2) {
                    curpath.push(new google.maps.LatLng(toadd[y], toadd[y + 1]));
                }
                curpath.push(new google.maps.LatLng(nameToObject(optimalroute[x]).lat, nameToObject(optimalroute[x]).lng));
            }
        }

        function indoorroute() {
            directionsDisplay.setMap();
            console.log($('input[name="routeType"]:checked').val());
            deleteMarkers();
            var sp = $("#h93kim_start :selected").text();
            var fp = $("#h93kim_finish :selected").text();
            if (sp == fp) {
                campusRoute.setPath([]);
            } else {
                addMarker(nameToObject(sp).lat, nameToObject(sp).lng, "Starting Point");
                printroute(sp, fp);
                addMarker(nameToObject(fp).lat, nameToObject(fp).lng, "Destination");
                console.log(optimalroute.join());
                var something = new google.maps.LatLng(nameToObject(sp).lat / 2 + nameToObject(fp).lat / 2, nameToObject(sp).lng / 2 + nameToObject(fp).lng / 2, true);
                curmap.setCenter(something);
                curmap.setZoom(16);
            }
        }

        function outdoorroute() {
            campusRoute.setPath([]);
            console.log($('input[name="routeType"]:checked').val());
            deleteMarkers();
            var sp = $("#h93kim_start :selected").text();
            var fp = $("#h93kim_finish :selected").text();
            if (sp == fp) {
                directionsDisplay.setMap();
            } else {
                directionsDisplay.setMap(curmap);
                var request = {
                    origin: (nameToObject(sp).doorlat + "," + nameToObject(sp).doorlng),
                    destination: (nameToObject(fp).doorlat + "," + nameToObject(fp).doorlng),
                    travelMode: google.maps.TravelMode.WALKING
                };
                directionsService.route(request, function (response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(response);
                    }
                });
            }
        }

        $("#h93kim_remove").click(function () {
            campusRoute.setPath([]);
            directionsDisplay.setMap();
            deleteMarkers();
        });

        $("#h93kim_search").click(function () {
            if ($('input[name="routeType"]:checked').val() == "indoor") {
                indoorroute();
            } else if ($('input[name="routeType"]:checked').val() == "outdoor") {
                outdoorroute();
            } else {
                $.getJSON("https://api.uwaterloo.ca/v2/weather/current.json", function (d) {
                    console.log(d.data.latitude + "and the time is " + d.data.observation_time);
                    if (d.data.temperature_current_c < 0 || d.data.precipitation > 0 || d.wind_speed_kph > 60) {
                        indoorroute();
                    } else {
                        outdoorroute();
                    }
                });
            }

        });

        $('.h93kim_select_group select').change(function () {
            var span = $(this).parent().children('span')
            span.html($(this).children('option:selected').text());
            if (span.hasClass('default')) {
                span.removeClass('default');
            }
        });

    }

    //dynamically loading google maps
    function loadGoogleMaps() {
        var script_tag = document.createElement('script');
        script_tag.type = "text/javascript";
        script_tag.src = "https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&callback=gMapsCallback";
        document.head.appendChild(script_tag);
    }

    /*
     * Initialize the widget.
     */
    console.log("Initializing h93kim(" + userid + ", " + htmlId + ")");
    $(window).bind('gMapsLoaded', initialize);
    loadGoogleMaps();
    portal.loadTemplates("widgets/h93kim/templates.json",
        function (t) {
            templates = t;
            $(htmlId).html(templates.baseHtml);
        }
    );
}