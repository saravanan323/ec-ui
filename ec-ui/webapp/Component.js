/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "com/ecui/model/models",
    "sap/ui/model/json/JSONModel",
    'sap/f/FlexibleColumnLayoutSemanticHelper',
    'sap/f/library',
    "sap/ui/core/IconPool"
],
    function (UIComponent, Device, models, JSONModel, FlexibleColumnLayoutSemanticHelper, fioriLibrary, IconPool) {
        "use strict";

        return UIComponent.extend("com.ecui.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                let oModel,
                    oRouter;

                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                oModel = new JSONModel();
                this.setModel(oModel);

                // enable routing
                oRouter = this.getRouter();
                oRouter.attachBeforeRouteMatched(this._onBeforeRouteMatched, this);
                oRouter.initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
                this.setModel(new JSONModel(), "errors");
                this.setModel(new JSONModel(), "sideNavigation")

                let oSettingsModel = new JSONModel({ navigatedItem: "" });
                this.setModel(oSettingsModel, 'settings');

                // Create and set the JSON model globally
                let currencies = new JSONModel(sap.ui.require.toUrl("com/ecui/model/currencies.json"));
                this.setModel(currencies, "currenciesMdl");

                // Create and set the JSON model globally
                let measure_unit_code = new JSONModel(sap.ui.require.toUrl("com/ecui/model/measure_unit_code.json"));
                this.setModel(measure_unit_code, "measureUnitCodeMdl");

                let master_data = new JSONModel(sap.ui.require.toUrl("com/ecui/model/data.json"));
                this.setModel(master_data, "masterDataMdl");

                //Icon Register
                this.iconPoolRegister()
            },

            _onBeforeRouteMatched: function (oEvent) {
                let oModel = this.getModel(),
                    sLayout = oEvent.getParameters().arguments.layout,
                    oNextUIState;

                // If there is no layout parameter, query for the default level 0 layout (normally OneColumn)
                if (!sLayout) {
                    this.getHelper().then(function (oHelper) {
                        oNextUIState = oHelper.getNextUIState(0);
                        oModel.setProperty("/layout", oNextUIState.layout);
                    });
                    return;
                }

                oModel.setProperty("/layout", sLayout);
            },
            getHelper: function () {
                return this._getFcl().then(function (oFCL) {
                    let oSettings = {
                        defaultTwoColumnLayoutType: fioriLibrary.LayoutType.TwoColumnsMidExpanded,
                        defaultThreeColumnLayoutType: fioriLibrary.LayoutType.ThreeColumnsMidExpanded,
                    };
                    return (FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings));
                });
            },
            _getFcl: function () {
                return new Promise(function (resolve, reject) {
                    let oView = this.getRootControl().getContent()[0]?.getPages().find(e => e.getProperty("viewName") == "com.ecui.view.AppUnified");
                    let oFCL = oView?.byId("fcl")
                    if (!oFCL) {
                        oView?.attachAfterInit(function (oEvent) {
                            resolve(oEvent.getSource().byId('flexibleColumnLayout'));
                        }, this);
                        return;
                    }
                    resolve(oFCL);

                }.bind(this));
            },
            iconPoolRegister: function () {
                let b = [];
                let c = {};
                //Fiori Theme font family and URI
                let t = {
                    fontFamily: "SAP-icons-TNT",
                    fontURI: sap.ui.require.toUrl("sap/tnt/themes/base/fonts/")
                };
                //Registering to the icon pool
                IconPool.registerFont(t);
                b.push(IconPool.fontLoaded("SAP-icons-TNT"));
                c["SAP-icons-TNT"] = t;
                //SAP Business Suite Theme font family and URI
                let B = {
                    fontFamily: "BusinessSuiteInAppSymbols",
                    fontURI: sap.ui.require.toUrl("sap/ushell/themes/base/fonts/")
                };
                //Registering to the icon pool
                IconPool.registerFont(B);
                b.push(IconPool.fontLoaded("BusinessSuiteInAppSymbols"));
                c["BusinessSuiteInAppSymbols"] = B;
            },
            getContentDensityClass: function () {
                if (!this._sContentDensityClass) {
                    if (!Device.support.touch) {
                        this._sContentDensityClass = "sapUiSizeCozy";
                    } else {
                        this._sContentDensityClass = "sapUiSizeCozy";
                    }
                }
                return this._sContentDensityClass;
            }
        });
    }
);