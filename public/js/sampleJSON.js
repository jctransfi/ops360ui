var dashboardObj = {
    "customer_info": {
        "customer-name": "Mondelez International, Inc",
        "acg": 1234456,
        "csn": 123456,
        "masteracctid": 123456,
        "account-mgr": "KBAYS",
        "sales-engr": "MRICHARD_T",
        "project-mgr": "EROY"
    },
    "site-info": {
        "vlid": "CAEDUB23",
        "vhid": [
            "CAEDUB12-AVIALL-RTR-2",
            "CAEDUB12-AVIALL-RTR-2"
        ],
        "suppressed": true,
        "localtime": "date object",
        "related-w": [
            "if this is ntt"
        ]
    },
    "escalation": {
        "escalation": "big chunk of text"
    },
    "graphs": {
        "smoke": "graphURL",
        "performance": "graphURL"
    },
    "interface": [
        {
            "vhid": "CAEDUB12-AVIALL-RTR-2",
            "status": "UP",
            "mgtstatus": "MANAGED",
            "IP": "74.106.125.255"
        },
        {
            "vhid": "CAEDUB12-AVIALL-RTR-2",
            "status": "UP",
            "mgtstatus": "MANAGED",
            "IP": "74.106.125.255"
        }
    ],
    "circuit": [
        {
            "vcid": "CI-CAEDUB12-1",
            "origvhid": "CAEDUB12-AVIALL-RTR-2",
            "termvhid": "CAEDUB12-AVIALL-RTR-2",
            "linktype": "Primary",
            "speed": "1Mbps",
            "provider": "ETISALAT",
            "lastmile": "lastmile provider",
            "LEC": "aundefinedc 314993230",
            "wnum": "if NTT",
            "related-w": "if NTT",
            "vrnum": 132456,
            "vcomlink": "link to the VCOM url for this circuit",
            "providerlink": "link to provider escalation details as in VCOMs"
        },
        {
            "vcid": "CI-CAEDUB12-1",
            "origvhid": "CAEDUB12-AVIALL-RTR-2",
            "termvhid": "CAEDUB12-AVIALL-RTR-2",
            "linktype": "Primary",
            "speed": "1Mbps",
            "provider": "ETISALAT",
            "lastmile": "lastmile provider",
            "LEC": "aundefinedc 314993230",
            "wnum": "if NTT",
            "related-w": "if NTT",
            "vrnum": 132456,
            "vcomlink": "link to the VCOM url for this circuit",
            "providerlink": "link to provider escalation details as in VCOMs"
        }
    ],
    "hardware": [{
        "lcf_flag": "data",
        "model": "model number",
        "serial": "serial number",
        "type": "hardware type"
    }],
    "tickets": {},
    "oob": [
        {
            "vhid": "CAEDUB12-AVIALL-RTR-2",
            "number": "2125550614",
            "comments": "OOB Tested.",
            "last_status": "status"
        },
        {
            "vhid": "DOKTUL1-MONDELEZ-SWTH-1",
            "number": "19182950276",
            "comments": "some text",
            "last_status": "status"
        }
    ],
    "nerc": [
        {
            "vhid": "CAEDUB12-AVIALL-RTR-2",
            "date": "2014-03-12T13:37:27+00:00",
            "wnum": "if NTT",
            "type": "Performance",
            "subtype": "Utilization",
            "source": "VRTG",
            "ticket": "123456789"
        },
        {
            "vhid": "CAEDUB12-AVIALL-RTR-2",
            "date": "2014-03-12T13:37:27+00:00",
            "wnum": "if NTT",
            "type": "Up",
            "subtype": "Node",
            "source": "proxy_ping@virtela.net",
            "ticket": "123456789"
        }
    ],
    "comments": [
        {
            "date": "2014-03-12T13:37:27+00:00",
            "comment": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
            "user": "Peter Piper"
        },
        {
            "date": "2014-03-16T13:37:27+00:00",
            "comment": "Ut enim ad minim veniam, quis nostrud ",
            "user": "Jane Smith"
        },
        {
            "date": "2014-03-17T23:37:27+00:00",
            "comment": "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "user": "John Doe"
        }
    ],
    "documents": {
        "docid": {
            "filename": "filname.doc",
            "doctype": "document type",
            "docURL": "alfresco URL"
        }
    }
}

//map document type to a JSOS file of icon URLS