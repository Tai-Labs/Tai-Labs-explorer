var BlocksApp = angular.module("BlocksApp", [
    "ui.router", 
    "ui.bootstrap", 
    "oc.lazyLoad",  
    "ngSanitize"
]); 

BlocksApp.config(['$ocLazyLoadProvider',  '$locationProvider', 
    function($ocLazyLoadProvider, $locationProvider) {
    $ocLazyLoadProvider.config({
        cssFilesInsertBefore: 'ng_load_plugins_before' // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
    });
    $locationProvider.html5Mode({
      enabled: true
    });
}]);


/* Setup global settings */
BlocksApp.factory('settings', ['$rootScope', '$http', function($rootScope, $http) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: false, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: '/',
        globalPath: '/',
        layoutPath: '/',
    };

    $rootScope.settings = settings;
    return settings;
}]);

/* Setup App Main Controller */
BlocksApp.controller('MainController', ['$scope', '$location', function($scope, $location) {
    $scope.$on('$viewContentLoaded', function() {
        //App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });
    $scope.form = {};
    $scope.searchQuery = function(s) {
        var search = s.toLowerCase();
        search = search.replace(/(^\s*)|(\s*$)/g, "");
        search = search.replace(/\"/g, "");

        $scope.form.searchInput="";
        $scope.form.searchForm.$setPristine();
        $scope.form.searchForm.$setUntouched();
        console.log("search--",search)
        console.log("isAddress(search)--",isAddress(search))
        if (isAddress(search)) 
            $location.path("/addr/" + search);
        else if(search.length==16)//master node address
            $location.path("/masternode/" + search);
        else if(search.length==18){//master node address
            if(search.indexOf("0x")==0 ||search.indexOf("tit")==0){
                $location.path("/masternode/" + search.substr(2));
            }
        }
        else if (isTransaction(search))
            $location.path("/tx/" + search);
        else if (!isNaN(search))
            $location.path("/block/" + search);
        else 
            $scope.form.searchInput = search;

    }
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive.
***/
/* Setup Layout Part - Header */
BlocksApp.controller('HeaderController', ['$scope', '$location', function($scope, $location) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });

    $scope.form = {};
    $scope.searchQuery = function(s) {
        var search = s.toLowerCase();
        search = search.replace(/(^\s*)|(\s*$)/g, "");
        search = search.replace(/\"/g, "");

        $scope.form.searchInput="";
        $scope.form.searchForm.$setPristine();
        $scope.form.searchForm.$setUntouched();
        if (isAddress(search)) 
            $location.path("/addr/" + search);
        else if(search.length==16)//master node address
            $location.path("/masternode/" + search);
        else if(search.length==18){//master node address
            if(search.indexOf("0x")==0){
                $location.path("/masternode/" + search.substr(2));
            }
        }
        else if (isTransaction(search))
            $location.path("/tx/" + search);
        else if (!isNaN(search))
            $location.path("/block/" + search);
        else 
            $scope.form.searchInput = search;

    }
}]);

/* Search Bar */
BlocksApp.controller('PageHeadController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {        
        
    });
}]);

/* Setup Layout Part - Footer */
BlocksApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
BlocksApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("home");
    
    $stateProvider

        // Dashboard
        .state('home', {
            url: "/home",
            templateUrl: "views/home.html",            
            data: {pageTitle: 'Blockchain Explorer'},
            controller: "HomeController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'BlocksApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                            '/js/controllers/HomeController.js',
                            '/css/todo-2.min.css'
                        ]}]);
                }]
            }
        })

        .state('address', {
            url: "/addr/{hash}",
            templateUrl: "views/address.html",
            data: {pageTitle: 'Address'},
            controller: "AddressController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'BlocksApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                             '/js/controllers/AddressController.js',
                            '/plugins/datatables/datatables.min.css',
                            '/plugins/datatables/datatables.bootstrap.css',
                            '/plugins/datatables/datatables.all.min.js',
                            '/plugins/datatables/datatable.min.js'
                        ]
                    });
                }]
            }
        })

        .state('block', {
            url: "/block/{number}",
            templateUrl: "views/block.html",
            data: {pageTitle: 'Block'},
            controller: "BlockController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'BlocksApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                             '/js/controllers/BlockController.js'
                        ]
                    });
                }]
            }
        })

        .state('tx', {
            url: "/tx/{hash}",
            templateUrl: "views/tx.html",
            data: {pageTitle: 'Transaction'},
            controller: "TxController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'BlocksApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                             '/js/controllers/TxController.js'
                        ]
                    });
                }]
            }
        })

        .state('contract', {
            url: "/contract/{addr}",
            templateUrl: "views/contract.html",
            data: {pageTitle: 'Contract'},
            controller: "ContractController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'BlocksApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                             '/js/controllers/ContractController.js',
                             '/js/custom.js'
                         ]
                     });
                }]
            }
        })
        .state('verifycontract', {
            url: "/verifycontract/{addr}",
            templateUrl: "views/contractVerify.html",
            data: {pageTitle: 'Verify Contract'},
            controller: "ContractVerifyController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'BlocksApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                             '/js/controllers/ContractVerifyController.js',
                             '/js/custom.js'
                         ]
                     });
                }]
            }
        })
        // .state('stats', {
        //     url: "/stats/{chart}",
        //     templateUrl: "views/stats/index.html",
        //     data: {pageTitle: 'Transaction'},
        //     controller: "StatsController",
        //     resolve: {
        //         deps: ['$ocLazyLoad', '$stateParams', function($ocLazyLoad, $stateParams) {
        //             var bundle = '/js/stats/bundle_';

        //             switch ($stateParams.chart) {
        //                 case "etc_hashrate":
        //                     bundle = bundle + "hashrate.js";
        //                     break;
        //                 case "miner_hashrate":
        //                     bundle = bundle + "hashrate_distribution.js";
        //                     break;

        //                 case "The_bomb_chart":
        //                     bundle = bundle + "The_bomb_chart_with_ECIP_1010.js";
        //                     break;

        //             }

        //             return $ocLazyLoad.load({
        //                 insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
        //                 files: [
        //                      '/js/controllers/StatsController.js',
        //                      '/css/stats.css',
        //                      "https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.10/d3.js",
        //                      "/plugins/async.min.js",
        //                      bundle
        //                 ]
        //             });
        //         }]
        //     }
        // })
        .state('tokenlist', {
            url: "/tokenlist",
            templateUrl: "views/tokenlist.html",
            data: {pageTitle: 'Tokens'},
            controller: "TokenListController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'BlocksApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                             '/js/controllers/TokenListController.js'
                        ]
                    });
                }]
            }
        })
        .state('contractlist', {
            url: "/contractlist",
            templateUrl: "views/contractlist.html",
            data: {pageTitle: 'contractlist'},
            controller: "ContractListController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'BlocksApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                             '/js/controllers/ContractListController.js'
                        ]
                    });
                }]
            }
        })

        .state('token', {
            url: "/token/{hash}",
            templateUrl: "views/token.html",
            data: {pageTitle: 'Tokens'},
            controller: "TokenController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'BlocksApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                             '/js/controllers/TokenController.js'
                        ]
                    });
                }]
            }
        })

        .state('tokenAcc', {
            url: "/tokenAcc/{hash}",
            templateUrl: "views/token.html",
            data: {pageTitle: 'Tokens'},
            controller: "TokenController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'BlocksApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                             '/js/controllers/TokenController.js'
                        ]
                    });
                }]
            }
        })

        .state('masternode', {
            url: "/masternode/{witness}",
            templateUrl: "views/witness.html",
            data: {pageTitle: 'Masternode'},
            controller: "WitnessController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'BlocksApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                             '/js/controllers/WitnessController.js'
                        ]
                    });
                }]
            }
        })
        .state('masternodeList', {
            url: "/masternodeList",
            templateUrl: "views/witnessList.html",
            data: {pageTitle: 'Masternode List'},
            controller: "WitnessListController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'BlocksApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                             '/js/controllers/WitnessListController.js'
                        ]
                    });
                }]
            }
        })
        .state('publicAPIDoc', {
            url: "/publicAPIDoc",
            templateUrl: "views/publicAPIDoc.html",
            data: {pageTitle: 'Public API Document'},
            controller: "PublicAPIDocController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'BlocksApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                             '/js/controllers/PublicAPIDocController.js'
                        ]
                    });
                }]
            }
        })
        .state('dao', {
            url: "/dao",
            templateUrl: "views/dao.html",
            data: {pageTitle: 'theDAO'},
            controller: "DAOController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'BlocksApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                             '/js/controllers/DAOController.js'
                        ]
                    });
                }]
            }
        })
        .state('addressList', {
            url: "/addressList/{type}",
            templateUrl: "views/addressList.html",
            data: {pageTitle: 'Address List'},
            controller: "AddressListController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'BlocksApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                             '/js/controllers/AddressListController.js'
                        ]
                    });
                }]
            }
        })
        .state('rich-list', {
            url: "/rich-list/{type}",
            templateUrl: "views/addressList.html",
            data: {pageTitle: 'Address List'},
            controller: "AddressListController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'BlocksApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                             '/js/controllers/AddressListController.js'
                        ]
                    });
                }]
            }
        })

        .state('err404', {
            url: "/err404/{thing}/{hash}",
            templateUrl: "views/err_404.html",
            data: {pageTitle: '404 Not Found.'},
            controller: "ErrController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'BlocksApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                             '/js/controllers/ErrController.js'
                        ]
                    });
                }]
            }
        })
}]);

BlocksApp.filter('timeDuration', function() {
  return function(timestamp) {
    return getDuration(timestamp).toString();
  };
})
.filter('totalDifficulty', function() {
  return function(hashes) {
    return getDifficulty(hashes);
  };
}) 
.filter('teraHashes', function() {
    return function(hashes) {
        var result = hashes / Math.pow(1000, 4);
        return parseInt(result);
  }
})

/* Init global settings and run the app */
BlocksApp.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
}]);