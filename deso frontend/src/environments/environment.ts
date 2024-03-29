// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  // apiURL: "http://ec2-3-144-203-39.us-east-2.compute.amazonaws.com",
  apiURL: "http://localhost:3123",
  nodeUrl:  "http://ec2-3-21-40-233.us-east-2.compute.amazonaws.com",
  production: false,
  uploadImageHostname: "bitclout.com",
  jumioEndpointHostname: "bitclout.com",
  uploadVideoHostname: "bitclout.com",
  dd: {
    apiKey: "DCEB26AC8BF47F1D7B4D87440EDCA6",
    jsPath: "https://bitclout.com/tags.js",
    ajaxListenerPath: "bitclout.com/api",
    endpoint: "https://bitclout.com/js/",
  },
  node: {
    name: "Streamling",
    url: "localhost:4200"
  }
};
