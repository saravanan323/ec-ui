/*eslint-disable semi, no-console*/
(function (sap) {
    let getKeys = function (libOrComp, libOrCompKeysString) {
        // SAPUI5 delivered namespaces from https://ui5.sap.com/#/api/sap
        let ui5Libs = [
            "sap.apf",
            "sap.base",
            "sap.chart",
            "sap.collaboration",
            "sap.f",
            "sap.fe",
            "sap.fileviewer",
            "sap.gantt",
            "sap.landvisz",
            "sap.m",
            "sap.ndc",
            "sap.ovp",
            "sap.rules",
            "sap.suite",
            "sap.tnt",
            "sap.ui",
            "sap.uiext",
            "sap.ushell",
            "sap.uxap",
            "sap.viz",
            "sap.webanalytics",
            "sap.zen"
        ];
        Object.keys(libOrComp).forEach(function (libOrCompKey) {
            // ignore libs or Components that start with SAPUI5 delivered namespaces
            if (
                !ui5Libs.some(function (substring) {
                    return libOrCompKey === substring || libOrCompKey.startsWith(substring + ".");
                })
            ) {
                if (libOrCompKeysString.length > 0) {
                    libOrCompKeysString = libOrCompKeysString + "," + libOrCompKey;
                } else {
                    libOrCompKeysString = libOrCompKey;
                }
            }
        });
        return libOrCompKeysString;
    };

    let updateManifest = function (manifest) {
        let result = "";
        if (manifest) {
            if (manifest["sap.ui5"] && manifest["sap.ui5"].dependencies) {
                if (manifest["sap.ui5"].dependencies.libs) {
                    result = getKeys(manifest["sap.ui5"].dependencies.libs, result);
                }
                if (manifest["sap.ui5"].dependencies.components) {
                    result = getKeys(manifest["sap.ui5"].dependencies.components, result);
                }
            }
            if (manifest["sap.ui5"] && manifest["sap.ui5"].componentUsages) {
                result = getKeys(manifest["sap.ui5"].componentUsages, result);
            }
        }
        return result;
    };

    let fioriToolsGetManifestLibs = function (manifestPath) {
        let url = manifestPath;
        return new Promise(function (resolve, reject) {
            $.ajax(url)
                .done(function (manifest) {
                    resolve(updateManifest(manifest));
                })
                .fail(function () {
                    reject(new Error("Could not fetch manifest at '" + manifestPath));
                });
        });
    };

    let updateModuleDefinition = function (data) {
        if (data) {
            Object.keys(data).forEach(function (moduleDefinitionKey) {
                let moduleDefinition = data[moduleDefinitionKey];
                if (moduleDefinition && moduleDefinition.dependencies) {
                    moduleDefinition.dependencies.forEach(function (dependency) {
                        if (dependency.url && dependency.url.length > 0 && dependency.type === "UI5LIB") {
                            jQuery.sap.log.info(
                                "Registering Library " + dependency.componentId + " from server " + dependency.url
                            );
                            jQuery.sap.registerModulePath(dependency.componentId, dependency.url);
                        }
                    });
                }
            });
        }
    };

    /**
     * Registers the module paths for dependencies of the given component.
     * @param {string} manifestPath The the path to the app manifest path
     * for which the dependencies should be registered.
     * @returns {Promise} A promise which is resolved when the ajax request for
     * the app-index was successful and the module paths were registered.
     */
    sap.registerComponentDependencyPaths = function (manifestPath) {
        /*eslint-disable semi, consistent-return*/
        return fioriToolsGetManifestLibs(manifestPath).then(function (libs) {
            if (libs && libs.length > 0) {
                let url = "/sap/bc/ui2/app_index/ui5_app_info?id=" + libs;
                let sapClient = jQuery.sap.getUriParameters().get("sap-client");
                if (sapClient && sapClient.length === 3) {
                    url = url + "&sap-client=" + sapClient;
                }
                return $.ajax(url).done(updateModuleDefinition);
            }
        });
    };
})(sap);

/*eslint-disable sap-browser-api-warning, sap-no-dom-access*/
let scripts = document.getElementsByTagName("script");
let currentScript = document.getElementById("locate-reuse-libs");
if (!currentScript) {
    currentScript = document.currentScript;
}
let manifestUri = currentScript.getAttribute("data-sap-ui-manifest-uri");
let componentName = currentScript.getAttribute("data-sap-ui-componentName");
let useMockserver = currentScript.getAttribute("data-sap-ui-use-mockserver");
let bundleResources = function () {
    jQuery.sap.require("jquery.sap.resources");
    let sLocale = sap.ui.getCore().getConfiguration().getLanguage();
    let oBundle = jQuery.sap.resources({
        url: "i18n/i18n.properties",
        locale: sLocale
    });
    document.title = oBundle.getText("appTitle");
};
sap.registerComponentDependencyPaths(manifestUri)
    .catch(function (error) {
        jQuery.sap.log.error(error);
    })
    .finally(function () {
        // setting the app title with internationalization
        sap.ui.getCore().attachInit(bundleResources);

        if (componentName && componentName.length > 0) {
            if (useMockserver && useMockserver === "true") {
                sap.ui.getCore().attachInit(function () {
                    sap.ui.require([componentName.replace(/\./g, "/") + "/localService/mockserver"], function (server) {
                        // set up test service for local testing
                        server.init();
                        // initialize the ushell sandbox component
                        sap.ushell.Container.createRenderer().placeAt("content");
                    });
                });
            } else {
                // Requiring the ComponentSupport module automatically executes the component initialisation for all declaratively defined components
                sap.ui.require(["sap/ui/core/ComponentSupport"]);

                // setting the app title with the i18n text
                sap.ui.getCore().attachInit(bundleResources);
            }
        } else {
            sap.ui.getCore().attachInit(function () {
                // initialize the ushell sandbox component
                sap.ushell.Container.createRenderer().placeAt("content");
            });
        }
    });

sap.registerComponentDependencyPaths(manifestUri);
