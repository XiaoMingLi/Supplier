angular.module('DS.controllers', [])

//首页
.controller('homeController', function ($scope, $filter, $rootScope, $ionicHistory, $ionicScrollDelegate, $ionicSlideBoxDelegate, $timeout, HttpFact, PopupFact, privilegeFact, ModalFact) {

    ////////获取热销产品数据//////////
    var page = 1;
    var size = 4;
    $scope.noData = true;
    $scope.hotProduct = {
        array_1: []
    }

    function getData(current, count, provId, strW, orderby) {
        var submitData = {
            current: current, //当前页数
            count: count, //单页条数
            provId: provId,
            strW: "",
            orderby: "PD.p_saleNum DESC,"
        }
        HttpFact.post(domain + "/api/Product/getProductList", submitData).then(
            function (data) {
                jsonData = JSON.parse(data);
                pageCount = Number(jsonData.array_0[0].pageCount);
                pageNow = Number(jsonData.array_0[0].pageNow);
                if (pageCount < pageNow) {
                    $scope.noData = false;
                }
                else if (pageCount == pageNow) {
                    $scope.hotProduct.array_1 = $scope.hotProduct.array_1.concat(jsonData.array_1);
                    $scope.noData = false;
                }
                else {
                    $scope.hotProduct.array_1 = $scope.hotProduct.array_1.concat(jsonData.array_1);
                };
                $ionicScrollDelegate.resize();
                $scope.$broadcast("scroll.infiniteScrollComplete");
            }
        )
    }

    /////轮播
    //清除缓存，否则轮播报错
    $rootScope.$on("$ionicView.enter", function () {
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
    });
    $scope.banners = [];
    function getBanner(provId, count) {
        var submit = {
            provId: provId,
            count: count,
        }
        HttpFact.post(domain + "/api/Art/getBanner", submit).then(
            function (data) {
                $scope.banners = JSON.parse(data);
                $ionicSlideBoxDelegate.update();
                $ionicScrollDelegate.resize();
                $scope.$broadcast("scroll.infiniteScrollComplete");
            },
            function (data) {
                $scope.banners = [];
            }
        )
    }


    /////新品上架
    $scope.newProducts = [];
    function getNew(current, count, provId, strW, orderby) {
        var submitData = {
            current: current, //当前页数
            count: count, //单页条数
            provId: provId,
            strW: strW,
            orderby: orderby
        }
        HttpFact.post(domain + "/api/Product/getProductList", submitData).then(
            function (data) {
                $scope.newProducts = JSON.parse(data);
                $ionicSlideBoxDelegate.update();
                $ionicScrollDelegate.resize();
                $scope.$broadcast("scroll.infiniteScrollComplete");
            },
            function (data) {
                $scope.newProducts = [];
            }
        )
    }

    //离开视图时执行事件
    $scope.$on("$ionicView.beforeLeave", function () {
        ModalFact.hide();
    });
    $scope.AllModel = {
        SearchModel: [

        ],
    };
    if (localStorage.getItem("SearchList")) {
        var UserSearchList = JSON.parse(localStorage.getItem("SearchList"));
        $scope.AllModel.SearchModel = UserSearchList;
    }

    $scope.SetCheck = function (v1, v2) {
        for (var i = 0; i < v2.length; i++) {
            v2[i].Check = false;
        }
        v1.Check = !v1.Check;
    };

    $scope.onItemDelete = function (item) {
        $scope.AllModel.SearchModel.splice($scope.AllModel.SearchModel.indexOf(item), 1);
    }
    $scope.onDelete = function () {
        $scope.AllModel.SearchModel = [];
    }


    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getData(page, size, 1, 0, "");
        getBanner(1, 3);
        getNew(1, 3, 1, "", "PD.p_saleNum DESC,")
    });

    //加载数据事件
    $scope.loadMore = function () {
        page++;
        getData(page, size, 1, 0, "");
        getBanner(1, 3);
    }



})


//产品
.controller('productListController', function ($scope, ModalFact,HttpFact, $ionicScrollDelegate) {

    $scope.screenClick = function () {
        ModalFact.show($scope, "/templates/model/pd-Screening.html");
    };
    $scope.closeModal = function () {
        ModalFact.hide();
    };

    var page = 1;
    var size = 6;
    $scope.noData = true;
    $scope.listProduct = {
        array_1: []
    }
    function getData(current, count, provId, strW, orderby) {
        var submitData = {
            current: current, //当前页数
            count: count, //单页条数
            provId: provId,
            strW: "",
            orderby: "PD.p_addtime DESC,"
        }
        HttpFact.post(domain + "/api/Product/getProductList", submitData).then(
            function (data) {
                jsonData = JSON.parse(data);
                pageCount = Number(jsonData.array_0[0].pageCount);
                pageNow = Number(jsonData.array_0[0].pageNow);
                console.log(jsonData)
                if (pageCount < pageNow) {
                    $scope.noData = false;
                }
                else if (pageCount == pageNow) {
                    $scope.listProduct.array_1 = $scope.listProduct.array_1.concat(jsonData.array_1);
                    $scope.noData = false;
                }
                else {
                    $scope.listProduct.array_1 = $scope.listProduct.array_1.concat(jsonData.array_1);
                };
                $ionicScrollDelegate.resize();
                $scope.$broadcast("scroll.infiniteScrollComplete");
            }
        )
    }

   
    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getData(page, size, 1, 0, "");
        
    });
    //离开视图时执行事件
    $scope.$on("$ionicView.beforeLeave", function () {
        ModalFact.hide();
    });


    $scope.SetCheck = function (v1, v2) {
        for (var i = 0; i < v2.length; i++) {
            v2[i].Check = false;
        }
        v1.Check = !v1.Check;
    };

    //加载数据事件
    $scope.loadMore = function () {
        page++;
        getData(page, size, 1, 0, "");
    }
})
.controller('productDetailsController', function ($scope, $ionicPopover,filterFilter, $timeout, $ionicScrollDelegate, $stateParams, $state, $rootScope, HttpFact, judgeFact, PopupFact, $ionicSlideBoxDelegate) {
    $scope.input ={}

    $scope.lowNumber ={
       low1: 100,
       low2: 250,
       low3: 1000,
    }

    //商品详情(基本包)
    $scope.basicImg = []
    $scope.parmeImg = []
    $scope.basicData = []
    $scope.miniNum = [] //最低购买数量
    
    
    function getDetailData(Id) {
        HttpFact.get(domain + "/api/Product/getProductDetail", { Id: Id }).then(
            function (data) {
                $scope.basicData = JSON.parse(data);
                $scope.basicImg = $scope.basicData[0].p_Pic.split(',');
               
                console.log($scope.basicData)
                $scope.miniNum = Number($scope.basicData[0].p_valuationNum);
                $scope.lowNumber.low1 = Number($scope.basicData[0].p_priceScopeTitle1);
                $scope.lowNumber.low2 = Number($scope.basicData[0].p_priceScopeTitle2);
                $scope.lowNumber.low3 = Number($scope.basicData[0].p_priceScopeTitle3);

            },
            function (data) {
                $scope.basicData = []
            }
        )
    }

    $scope.initial1 ='',
    $scope.initial2 ='';
    $scope.initial3 ='';
    //商品详情(参数包)
    $scope.detailParme = [];
    $scope.storages = [] 
    function getParame(Id) {
        var sunmit = {
            Id: Id
        }
        HttpFact.get(domain + "/api/Product/getProductParame", sunmit).then(
            function (data) {
                $scope.detailParme = JSON.parse(data)
                $scope.input.color = $scope.detailParme.p_param1;
                $scope.parmeImg = $scope.detailParme[0].p_pic.split(',');
                console.log($scope.detailParme)

                //匹配版本
                var obj = filterFilter($scope.detailParme, { p_param1: $scope.input.color }, true);
                $scope.TypeModelList = [];  //版本
                var type = []
                for (var i = 0; i < obj.length; i++) {
                    type.push(obj[i].p_param2);
                }
                $scope.TypeModelList=unique(type)
                //unique
                var temp = [] //定义变量存储push的数据
                $scope.temps = [];
                
                for(var i = 0; i < $scope.detailParme.length; i++) {
                    temp.push($scope.detailParme[i].p_param1);
                }
                
                $scope.temps=unique(temp)

                //initial
                $scope.initial1 = $scope.detailParme[0].p_priceScope1;
                $scope.initial2 = $scope.detailParme[0].p_priceScope2;
                $scope.initial3 = $scope.detailParme[0].p_priceScope3;
               
                console.log($scope.initial3+ '2')
                
            },
            function (data) {
                $scope.detailParme = [];
            }
        )
    }

    console.log($scope.initial3+ '1')
    //去重复
    function unique(arr)
    {
        var tmp = new Array();

        for (var m in arr)
        {
            tmp[arr[m]] = 1;
        }

        //再把键和值的位置再次调换
        var tmparr = new Array();

        for (var n in tmp)
        {
            tmparr.push(n);
        }

        return tmparr;
    }


    //选中颜色和版本
    var value ='';
    var key ='';
    $scope.prices = {
        price1: '',
        price2: '',
        price3: ''
    }
    $scope.storage = '';
    console.log($scope.storage + "storage1")
    function match() {
        if(value == '' || key =='')
        {
            return;
        }
        else{
            var arr = filterFilter($scope.detailParme, { p_param2:key ,p_param1: value }, true)
            for(var i = 0; i < arr.length; i++) {
                $scope.prices.price1=arr[i].p_priceScope1
                $scope.prices.price2=arr[i].p_priceScope2
                $scope.prices.price3=arr[i].p_priceScope3
                $scope.storage = Number(arr[i].p_storage);
            }
            
        }
    }
    $scope.num_check1 = false;
    $scope.num_check2 = false;
    $scope.num_check3 = false;
    //判断数量
    function judge_storage() {
        if(value == '' || key =='') {
            return;
        }
        else {

            if($scope.minimum < $scope.lowNumber.low1) {
                $scope.num_check1 = !$scope.num_check1
                
            }
            else if ($scope.minimum > $scope.lowNumber.low1 || $scope.minimum < $scope.lowNumber.low3){
                $scope.num_check2 = !$scope.num_check2
                
            }
            else if ($scope.minimum >= $scope.lowNumber.low3){
                $scope.num_check3 = !$scope.num_check3
                
            }
        }
        

    }
    //选择版本
    $scope.input.version = []
    $scope.select_version = function(version){
        $scope.input.version =version;
        key = version;
        match();
        
    }

    //选择颜色
    $scope.select_color = function(item) {
        
        $scope.input.color = item;
        value = item;
        match();
        //过滤相同
        var obj = filterFilter($scope.detailParme, { p_param1: item }, true);
        $scope.TypeModelList = [];
        for (var i = 0; i < obj.length; i++) {
            $scope.TypeModelList.push(obj[i].p_param2);
        }

    }

    //商品信息购买界面
    $scope.popoverPro;
    $ionicPopover.fromTemplateUrl("/templates/model/ez-popover.html", {
        scope: $scope
    })
    .then(function (popover) {
        $scope.popoverPro = popover;
    });

    //打开商品信息购买界面
    $scope.payProClick = function ($event) {
        $scope.popoverPro.show($event);
    };
    //关闭商品信息购买界面
    $scope.closePopover = function () {
        $scope.popoverPro.hide();
    };
    //销毁事件回调处理：清理popover对象
    $scope.$on("$destroy", function () {
        $scope.popoverPro.remove();
    });


    
    // $scope.changeTotal = {
    //     changeNum: ''
    // };


    // $scope.num_total = function() {

    //     $scope.miniNum = value;
    //     if(value == ''){
    //         $scope.miniNum;
    //     }
    //     console.log(value)
    // }

    // function add(){
    //     if($scope.miniNum == "" || $scope.miniNum <1){
    //        return $scope.miniNum = 1;
    //     }
    //     else{
    //         $scope.miniNum++;
    //     }
    // }


    var arr = [];
    var inStock = 500;

    var miniNum = '';

    $scope.varlist = {
        itemNum: 1,
        total: 1,
    }

    // 减
    $scope.minus = function () {
        if ($scope.varlist.itemNum == 1) {
            return;
        } else {
            $scope.varlist.itemNum--;
        }
    }
    // 加
    $scope.add = function () {
        if ($scope.varlist.itemNum >= inStock) {
            alert("已达到最大库存数量");
        } else {
            $scope.varlist.itemNum++;
        }
    }

    $scope.Numblur = function () {
        if ($scope.varlist.itemNum > inStock) {
            $scope.varlist.itemNum = inStock;
        }
    }

    $scope.isActive = false;
    $scope.ChangeIsActive = function () {
        $scope.isActive = !$scope.isActive;
    }





    $scope.pList = {
        Size: 1,
        Page: 7,
        commodity: [{
            Name: "Beats Solo2 无线头戴式耳机 - 黑色",
            Banner: [
                {
                    Img: "/images/productDetailsBanner.jpg"
                },
                {
                    Img: "/images/productDetailsBanner.jpg"
                },
                {
                    Img: "/images/productDetailsBanner.jpg"
                },
                {
                    Img: "/images/productDetailsBanner.jpg"
                }
            ]
        }],
        classList: [
            {
                Class: "产品详情",
                List: [
                    {
                        ImgBa: "/images/category/TB2d_2DhFXXXXaEXXXXXXXXXXXX_!!647482297.jpg"
                    },
                    {
                        ImgBa: "/images/category/TB22T99hFXXXXXwXFXXXXXXXXXX_!!647482297.jpg"
                    },
                    {
                        ImgBa: "/images/category/TB24d6ehFXXXXbLXpXXXXXXXXXX_!!647482297.jpg"
                    },
                    {
                        ImgBa: "/images/category/TB2C_TmhFXXXXX_XpXXXXXXXXXX_!!647482297.jpg"
                    },
                    {
                        ImgBa: "/images/category/TB2c7fdhFXXXXbjXpXXXXXXXXXX_!!647482297.jpg"
                    },
                    {
                        ImgBa: "/images/category/TB2e4rkhFXXXXaDXpXXXXXXXXXX_!!647482297.jpg"
                    },
                    {
                        ImgBa: "/images/category/TB2gkfAhFXXXXbDXXXXXXXXXXXX_!!647482297.jpg"
                    },
                    {
                        ImgBa: "/images/category/TB2juTHhFXXXXagXXXXXXXXXXXX_!!647482297.jpg"
                    },
                    {
                        ImgBa: "/images/category/TB2M1HfhFXXXXaMXpXXXXXXXXXX_!!647482297.jpg"
                    },
                    {
                        ImgBa: "/images/category/TB2qXTJhFXXXXX4XXXXXXXXXXXX_!!647482297.jpg"
                    },
                    {
                        ImgBa: "/images/category/TB2UQYyhFXXXXb1XXXXXXXXXXXX_!!647482297.jpg"
                    }
                ]
            },
            {
                Class: "成交()",
                List: [
                    
                ]
            },
            {
                Class: "评价()",
                List: [
                    {
                        Img: "/images/product/1.jpg",
                        userName: "古道边",
                        EvaTime: "2016-12-22",
                        Review: "音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错音质不错",
                        Picture: ["/images/product/1.jpg", "/images/product/2.jpg", "/images/product/3.jpg", "/images/product/1.jpg", "/images/product/2.jpg", "/images/product/3.jpg", "/images/product/1.jpg", "/images/product/2.jpg", "/images/product/3.jpg"]
                    },
                    {
                        Img: "/images/product/1.jpg",
                        userName: "古道边",
                        EvaTime: "2016-12-22",
                        Review: "音质不错",
                        Picture: ["/images/product/1.jpg", "/images/product/2.jpg"]
                    },
                    {
                        Img: "/images/product/1.jpg",
                        userName: "古道边",
                        EvaTime: "2016-12-22",
                        Review: "音质不错",
                        Picture: ["/images/product/1.jpg", "/images/product/2.jpg"]
                    },
                    {
                        Img: "/images/product/1.jpg",
                        userName: "古道边",
                        EvaTime: "2016-12-22",
                        Review: "音质不错",
                        Picture: ["/images/product/1.jpg", "/images/product/2.jpg"]
                    },
                    {
                        Img: "/images/product/1.jpg",
                        userName: "古道边",
                        EvaTime: "2016-12-22",
                        Review: "音质不错",
                        Picture: ["/images/product/1.jpg", "/images/product/2.jpg"]
                    },
                    {
                        Img: "/images/product/1.jpg",
                        userName: "古道边",
                        EvaTime: "2016-12-22",
                        Review: "音质不错",
                        Picture: ["/images/product/1.jpg", "/images/product/2.jpg"]
                    },
                ],
                GetCompanyThear: function (p1) {
                    alert(0)
                    $http.success(function (data, status, headers, config) {
                        switch (data) {
                            default:
                                $scope.CompanyThearList = [];
                                var ThearList = [];
                                var j = 1;
                                if (data.length >= 5) {
                                    for (var i = 0; i < data.length; i++) {
                                        ThearList.push({
                                            "Id": data[i].ProviderStyleType_Id,
                                            "Picture": data[i].ProviderStyleType_Image
                                        });
                                        if (j == 3) {
                                            $scope.CompanyThearList.push({
                                                "List": ThearList
                                            });
                                            ThearList = [];
                                            j = 0;
                                        }
                                        j++;
                                    }
                                }
                                ThearList = [];
                                if (data.length % 5 != 0) {
                                    var count = data.length % 5;
                                    for (var ii = count; ii > 0; ii--) {
                                        ThearList.push({
                                            "Id": data[data.length - ii].ProviderStyleType_Id,
                                            "Picture": data[data.length - ii].ProviderStyleType_Image
                                        });
                                    }
                                    $scope.CompanyThearList.push({
                                        "List": ThearList
                                    });
                                }
                                $timeout(function () {
                                    $ionicSlideBoxDelegate.$getByHandle("slideimgs").update();
                                    if ($scope.CompanyThearList.length <= 2) {
                                        $ionicSlideBoxDelegate.$getByHandle("slideimgs").loop(false);
                                    }
                                    else {
                                        $ionicSlideBoxDelegate.$getByHandle("slideimgs").loop(true);
                                    }
                                }, 300);
                                break;
                        }
                    }).error(function (data, status, headers, config) {
                        //alert("系统繁忙,请稍后重试！");   // 声明执行失败,即服务器返回错误  
                    });
                },
            },
            {
                Class: "进货保障",
                List: [
                    {
                        Description: "进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障进货保障"
                    }
                ]
            },

        ],

    };



    //
    $scope.De_Switch = {
        proIndex: 0,
        set: function (index) {
            $scope.De_Switch.proIndex = index;
            //重置滚动条高度
            $ionicScrollDelegate.resize();
        },
        get: function (index) {
            return $scope.De_Switch.proIndex == index;
        }
    }



    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getDetailData($stateParams.Id);
        getParame($stateParams.Id);
        $ionicSlideBoxDelegate.update();
        if ($scope.basicImg.length < 3) {
            $ionicSlideBoxDelegate.loop(false);
        }
        else {
            $ionicSlideBoxDelegate.loop(true);
        }

        $timeout(function () {
            $ionicSlideBoxDelegate.slide(0);
        })

    });

    //加载数据事件
    // $scope.loadMore = function () {
    //     page++;
    //     getDetailData($stateParams.Id)
    // }

})

//分类
.controller('categoryController', function ($scope, $state, $rootScope, HttpFact, judgeFact, PopupFact) {
    //获取数据
    $scope.proList = [];

    function getCategory() {
        HttpFact.get(domain + "/api/Product/getTypeList").then(
            function (data) {
                $scope.proList = JSON.parse(data);
            },

            function (data) {
                $scope.proList = [];
            }


        )
    }

    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getCategory();
    });

    $scope.proEvent = {
        proIndex: 0,
        set: function (index) {
            $scope.proEvent.proIndex = index;
        },
        get: function (index) {
            return $scope.proEvent.proIndex == index;
        },

    }
})

//某品牌列表
.controller('categoryListController', function ($scope, $filter, $stateParams, HttpFact) {
    var brandData; //接收返回data数据 
    var pageCount; //总页数
    var pageNow; //當前頁
    $scope.noData = true;
    $scope.brandCollect = {
        array_1: []
    }
    function getData(current, count, provId, strW) {
        var submit = {
            current: current, //當前頁
            count: count, // 單頁條數
            provId: provId,
            strW: strW
        }
        HttpFact.post(domain + "/api/Product/getProductList", submit).then(
            function (data) {
                brandData = JSON.parse(data)
                pageCount = Number(brandData.array_0[0].pageCount);
                pageNow = Number(brandData.array_0[0].pageNow);
                if (pageCount < pageNow) {
                    $scope.noData = false;
                }
                else if (pageCount == pageNow) {
                    $scope.brandCollect.array_1 = $scope.brandCollect.array_1.concat(brandData.array_1);
                    $scope.noData = false;
                }
                else {
                    $scope.brandCollect.array_1 = $scope.brandCollect.array_1.concat(brandData.array_1);
                };

                $scope.$broadcast("scroll.infiniteScrollComplete");
            },
            function (data) {
                $scope.brandCollect = {
                    array_1: []
                }
            }
        )
    }

    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getData(1, 6, 1, "and p_typeId=" + $stateParams.typeId + "and p_brandId=" + $stateParams.b_id);
    });

    //加载数据事件
    $scope.loadMore = function () {
        pageNow++;

    }

})

//咨讯
.controller('informationController', function ($scope, $filter, $stateParams, HttpFact) {

    var pageNow = 1; //当前页数
    var _size = 7;  //控制单页显示条数
    var jsonData; //接收返回data数据 
    var pageCount; //总页数
    $scope.noData = true;
    $scope.information = {
        array_1: [], //设置为空
    };

    function getInformation(type, current, count, strW, provId) {
        //获取数据所需参数
        var submitData = {
            type: type,
            current: current, //当前页数
            count: count, //单页条数
            strW: strW,
            provId: provId
        }

        HttpFact.post(domain + "/api/Art/getList", submitData).then(
            function (data) {
                jsonData = JSON.parse(data);
                pageCount = Number(jsonData.array_0[0].pageCount);
                pageNow = Number(jsonData.array_0[0].pageNow);
                if (pageCount < pageNow) {
                    $scope.noData = false;
                }
                else if (pageCount == pageNow) {
                    $scope.information.array_1 = $scope.information.array_1.concat(jsonData.array_1);
                    $scope.noData = false;
                }
                else {
                    $scope.information.array_1 = $scope.information.array_1.concat(jsonData.array_1);
                };

                $scope.$broadcast("scroll.infiniteScrollComplete");
            },
            function (data) {
                $scope.information = {
                    array_1: []
                };
            }
        )
    }

    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getInformation(1, pageNow, _size, "and 1 = 1", 1);
    });

    //加载数据事件
    $scope.loadMore = function () {
        pageNow++;
        getInformation(1, pageNow, _size, "and 1 = 1", 1);
    }
})

//咨讯详情

.controller('informationDetailController', function ($scope, $filter, $stateParams, HttpFact) {
    function getInformationDetail(Id) {
        return HttpFact.get(domain + "/api/Art/getDetail?id=" + Id).then(
            function (data) {
                $scope.informationDetail = JSON.parse(data);
            },
            function (data) {
                $scope.informationDetail = [];
            });
    }
    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getInformationDetail($stateParams.Id);
    });

})
//我的进货单
.controller('ordersHomeController', function ($scope, $ionicPopup) {
    $scope.input = {}
    $scope.cartData =
		[
            {
                name: "品牌商：深圳罗技电子科技有限公司1",
                goods: [{
                    id: 1,
                    tradeName: "Beats Solo1 无线头戴式耳机11",
                    amount: "￥" + 198.00,
                    color: "黑色",
                    edition: "普通版"
                }, {
                    id: 2,
                    tradeName: "Beats Solo8 无线头戴式耳机22",
                    amount: "￥" + 198.00,
                    color: "黑色",
                    edition: "普通版"
                }]

            }, {
                name: "品牌商：深圳罗技电子科技有限公司2",
                goods: [{
                    id: 3,
                    tradeName: "Beats Solo1 无线头戴式耳机33",
                    amount: "￥" + 198.00,
                    color: "黑色",
                    edition: "普通版"
                }, {
                    id: 4,
                    tradeName: "Beats Solo8 无线头戴式耳机44",
                    amount: "￥" + 198.00,
                    color: "黑色",
                    edition: "普通版"
                }
                ]
            }
		]


    $scope.flag = { showDelete: false };

    $scope.delete = function (index1, index2) {
        //if ($scope.cartData[index1].goods.length <= 1) {
        //    $scope.cartData.splice(index1, 1);
        //}
        //else {
        //    $scope.cartData[index1].goods.splice(index2, 1);
        //};
        for (var i = 0; i < index2.length; i++) {
            if (index2[i].id == index1.id) {
                index2.splice(i, 1)
            }
        }
    };
})


//订单详情
.controller('ordersDetailController', function ($scope, $state, $ionicPopover) {


    $scope.proData = [
        {
            name: "深圳罗技电子科技有限公司",
            goods: [
                {
                    id: 1,
                    tradeName: "Beats Solo1 无线头戴式耳机",
                    amount: "￥" + 198.00,
                    color: "黑色",
                    edition: "普通版"
                }
            ]
        }
    ]

    // //离开视图时执行事件
    // $scope.$on("$ionicView.beforeLeave", function () {
    //     $scope.closePrompt();

    // });

    // $scope.popover;

    $ionicPopover.fromTemplateUrl("/templates/model/proPrompt.html", {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    })

    $scope.proPrompt = function () {
        $scope.popover.show();
    }
    $scope.closePrompt = function () {
        $scope.popover.hide();
    };

    $scope.proReplace = function () {
        $scope.popover.remove();
        $state.go("replaceGoods");
    }

    $scope.exchange = function () {
        $scope.popover.remove();
        $state.go("backGoods");
    }

    // $scope.$on("$destroy", function () {
    //     $scope.popover.remove();
    //     alert('0')
    // });
    // $scope.$on("$destroy", function () {
    //     $scope.ppopover.remove();
    // });

})



//退货详情
.controller('returnsDetailController', function ($scope) {
    $scope.proData = [
            {
                name: "深圳罗技电子科技有限公司",
                goods: [
                    {
                        id: 1,
                        tradeName: "Beats Solo1 无线头戴式耳机",
                        amount: "￥" + 198.00,
                        color: "黑色",
                        edition: "普通版"
                    }
                ]
            }
    ]
})

//发票
.controller('invoiceController', function ($scope) {
    $scope.input = {}

    $scope.input.type = 1;
    $scope.active = function (key, value) {

        $scope.input[key] = value;
    }

    $scope.input.genre = 1;
    $scope.checked = function (key, value) {

        $scope.input[key] = value;
    }
})

//取货方式
.controller('pickupController', function ($scope) {
    $scope.input = {}
    $scope.pickData = [{

        name: "刘先生",
        phone: 13760269597,
        address: "深圳市南山区西丽街道南新花园A栋10H"
    }, {
        name: "陈先生",
        phone: 13760269597,
        address: "深圳市南山区西丽街道南新花园A栋10H"
    }]


    $scope.activeType = 0;
    $scope.is_pick = function (index) {

        $scope.activeType = index;
    }

    console.log($scope.activeType)

})


//评价详情

.controller('commentDetailController', function ($scope) {
    $scope.input = {}
    $scope.proData = [
        {
            id: 3,
            tradeName: "Beats Solo1 无线头戴式耳机",
            amount: "￥" + 198.00,
            color: "黑色",
            edition: "普通版",
            comment: "还行吧！ 粉色是欧洲买的 用了一年了已经 和这次买的比较了一下 外包装方面国内的真心简易了好多哦！总的来说我觉得粉色质感较好 线的柔软度更好些看着也略宽略厚实一些 耳机的金属质感粉色更强些 音质方面么我这种门外汉估计也分辨不出来的?? 因为我是外貌协会的"
        }
    ]
})


//会员中心--我的进货单

.controller('myOrdersController', function ($scope) {
    $scope.input = {}
    $scope.proData = [
            {
                name: "品牌商：深圳罗技电子科技有限公司1",
                goods: [{
                    id: 1,
                    tradeName: "Beats Solo1 无线头戴式耳机11",
                    amount: "￥" + 198.00,
                    color: "黑色",
                    edition: "普通版"
                }, {
                    id: 2,
                    tradeName: "Beats Solo8 无线头戴式耳机22",
                    amount: "￥" + 198.00,
                    color: "黑色",
                    edition: "普通版"
                }
                ]
            }, {
                name: "品牌商：深圳罗技电子科技有限公司2",
                goods: [{
                    id: 3,
                    tradeName: "Beats Solo1 无线头戴式耳机33",
                    amount: "￥" + 198.00,
                    color: "黑色",
                    edition: "普通版"
                }, {
                    id: 4,
                    tradeName: "Beats Solo8 无线头戴式耳机44",
                    amount: "￥" + 198.00,
                    color: "黑色",
                    edition: "普通版"
                }
                ]
            }
    ]


    $scope.flag = { showDelete: false };



    $scope.delete = function (index1, index2) {
        if ($scope.proData[index1].goods.length <= 1) {
            $scope.proData.splice(index1, 1);
        }
        else {
            $scope.proData[index1].goods.splice(index2, 1);
        };
    };
})


//会员中心--账户设置

.controller('basicDataController', function ($scope) {
    $scope.input = {}


    $scope.input = { gender: "先生" };
    $scope.single_check = function (name, value) {

        $scope.input[name] = value;
    }

    var vm = $scope.vm = {};
    vm.cb = function () {
        console.log(vm.CityPickData1.areaData)
        console.log(vm.CityPickData2.areaData)
        console.log(vm.CityPickData3.areaData)
        console.log(vm.CityPickData4.areaData)
    }
    vm.CityPickData2 = {
        areaData: ['请选择城市'],
        title: '没有初始城市',
        hardwareBackButtonClose: false
    }
})

//设置头像
.controller('avatarSettingsController', function ($scope,HttpFact) {
    
})

.controller('uploadAvatarController', function ($scope) {

})

//账户设置-收货地址管理
.controller('addressManageController', function ($scope) {
    $scope.input = {}
    $scope.pickData = [{

        name: "刘先生",
        phone: 13760269597,
        address: "深圳市南山区西丽街道南新花园A栋10H"
    }, {
        name: "陈先生",
        phone: 13760269597,
        address: "深圳市南山区西丽街道南新花园A栋10H"
    }]

    $scope.activeType = 0;
    $scope.is_pick = function (index) {

        $scope.activeType = index;
    }
})


//立即评价

.controller('reviewsController', function ($scope) {
    $scope.proData = [
            {
                name: "深圳罗技电子科技有限公司",
                goods: [
                    {
                        id: 1,
                        tradeName: "Beats Solo1 无线头戴式耳机",
                        amount: "￥" + 198.00,
                        color: "黑色",
                        edition: "普通版"
                    }
                ]
            }
    ]
})

//账户设置-地址管理 -- 添加新地址
.controller('newAddressController', function ($scope) {
    $scope.input = {}


    $scope.agree = true;
    $scope.is_agree = function () {
        $scope.agree = !$scope.agree;
    };
})

//退货操作
.controller('backGoodsController', function ($scope) {
    $scope.input = {}
    $scope.proDatas = [
        {
            name: "深圳罗技电子科技有限公司",
            products: [
                {
                    id: 1,
                    tradeName: "Beats Solo1 无线头戴式耳机",
                    amount: "￥" + 1980.00,
                    color: "黑色",
                    edition: "普通版",
                    number: 5,
                    Check: false
                }, {
                    id: 2,
                    tradeName: "Apple 数据闪充数据线",
                    amount: "￥" + 1980.00,
                    color: "黑色",
                    edition: "普通版",
                    Check: false
                }
            ]
        }
    ]

    //是否全选
    $scope.check_all = function () {



        // for(var i=0;i<$scope.proDatas[0].products.length;i++){

        //    $scope.proDatas[0].products[i].Check = !$scope.proDatas[0].products[i].Check;

        // }

        // prodata.Check = !prodata.Check;

        if ($scope.product_size == $scope.proDatas[0].products.length) {
            $scope.proDatas[0].products.map(function (c) {
                c.Check = false
                return c;
            });
            return;
        }

        $scope.proDatas[0].products.map(function (c) {
            c.Check = true
            return c;
        });


    }

    //单选
    $scope.toggle = function (pro) {
        return pro.Check = !pro.Check;
    }

    //计算总数量
    $scope.get_total = function () {
        var total = 0;
        $scope.product_size = 0;
        angular.forEach($scope.proDatas[0].products, function (value, key) {
            if (value.Check) {
                $scope.product_size++;
                total += 1;
            }
            console.log(key)
        });
        return total;
    };

})


//favoriteController收藏确认
.controller('favoriteController', function ($scope, $state, $ionicPopover) {
    $ionicPopover.fromTemplateUrl("/templates/model/confirm.html", {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    })

    $scope.confirm = function () {
        $scope.popover.show();

    }
    $scope.closeConfirm = function () {
        $scope.popover.hide();
    };

})

//登录
.controller('loginController', function ($scope, $state, $rootScope, HttpFact, judgeFact, PopupFact, privilegeFact) {

    $scope.input = {
        account: '',
        pwd:'',
        codeId: '',
        codeValue: '',
        fingerprint: new Fingerprint().get() //获取游览器指纹
    }

    $scope.countdown = {
        // count: "5",
        message: "获取验证码",
    }

    // $scope.countdown.callback = function(codeId,codeValue) {

    //     HttpFact.get(domain + "/api/verify/checkCode",{codeId:$scope.input.codeId,codeValue:$scope.input.sms_code}).then(
    //         function(data){
    //             console.log()
    //             $scope.countdown.reset = true;
    //         }
    //     )
        
    // }
    //数据获取
    //获取图片验证码
    function getcode(){
        HttpFact.get(domain + "/api/verify/getCode").then(
            function(data) {
                $scope.codeData = data;
                $scope.input.codeId = $scope.codeData.codeId;
                console.log(data)
            }
        )
    }
    $scope.code_active = function() {
        HttpFact.get(domain + "/api/verify/getCode").then(
            function(data) {
                $scope.codeData = data;
                $scope.input.codeId = $scope.codeData.codeId;
                console.log(data)
            }
        )
    }
    

    $scope.signin_action = function () {

        // if (judgeFact.mob($scope.input.account) == false) {
        //   return false;
        // }
        // if (judgeFact.email($scope.input.pwd) == false) {
        //   return false;
        // }

        if ($scope.input.account == "" || $scope.input.account == null) {
            PopupFact.alert("提示", "用户名不能为空");
            return false;
        };

        if ($scope.input.pwd == "" || $scope.input.pwd == null) {
          PopupFact.alert("提示", "密码不能为空");
          return false;
        };

        if ($scope.input.codeValue == "" || $scope.input.codeValue == null) {
          PopupFact.alert("提示", "验证码不能为空");
          return false;
        };

        HttpFact.post(domain + "/api/User/login", $scope.input).then(
        function (data) {
            
            console.log(data)
            switch (data) {
                case -0:
                    PopupFact.alert("提示", "用户名或密码输入有误");
                    break;
                case -1:
                    PopupFact.alert("提示", "您的账号违反规定，已被禁用，请联系工作人员!");
                    break;
                case -2:
                    PopupFact.alert("提示", "用户名不能为空");
                    break;
                case -3:
                    PopupFact.alert("提示", "密码不能为空");
                    break;  
                case -4:
                    PopupFact.alert("提示", "您输入的验证码有误");
                    break;    
                case -5: 
                    PopupFact.alert("提示", "获取不到信息，请重新登录");
                    break;
                default:
                    localStorage.setItem("User-Token", data);
                    // alert(localStorage.getItem("User-Token"))
                    break;
            };

        },
        function (data) {
            PopupFact.alert("提示", "登录失败");
        });

    }

    //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getcode();
        if (localStorage.getItem("User-Token") != undefined) {
            // $state.go("tabs.home");
        };
       
    });


})


//注册
.controller('signupController',function($scope, $state, $rootScope, HttpFact, judgeFact, PopupFact, privilegeFact){
    $scope.input = {
        
    }

    $scope.data = {
        account: $scope.input.username,
        pwd: $scope.input.pwd,
        s_name: $scope.input.realname,
        s_email: $scope.input.email,
        codeEValue: $scope.input.codeValue,
        s_phone: $scope.input.phone,
        s_idCard: $scope.input.IdCart,
        s_provId: $scope.input.provinceId,
        s_storeName: $scope.input.store_name,
        s_storeProv: $scope.input.province,
        s_storeCity: $scope.input.city,
        s_storeDist: $scope.input.district,
        s_storeDetailAddr: $scope.input.detail_address,
        s_identity: $scope.input.identity

    }

    //获取图片验证码
    function getcode(){
         HttpFact.get(domain + "/api/verify/getCode").then(
            function(data) {
                $scope.codeData = data;
                $scope.input.codeId = $scope.codeData.codeId;
               
            }
        )
    }

    $scope.signup_action = function(){

    }

     //视图第一次加载读取数据
    $scope.$on("$ionicView.loaded", function () {
        getcode();
        if (localStorage.getItem("User-Token") != undefined) {
            // $state.go("tabs.home");
        };
       
    });

})