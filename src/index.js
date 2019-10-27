import React from "react";
import ReactDOM from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

const client = new ApolloClient({
  uri: "https://localhost:4000/graphql",
  request: operation => {
    const token = localStorage.getItem("token");
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
        //authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxOSwidXNlcl9uYW1lIjoiam9zaGtlbm5lZHkiLCJ1c2VyX3Bhc3N3b3JkIjoiJDJhJDEwJG1DSk1Tek1lVi9tUGtSQ3pxNVU1YmVVS0NuZ0ExVnpiN1J0bmhJQ2VwQWlvOUpDYWdob2ZXIiwidXNlcl9lbWFpbCI6Impvc2hAb3V0dGhpbmtncm91cC5jb20iLCJpYXQiOjE1NzEzMTkxODUsImV4cCI6MTU3MTQwNTU4NX0.upZcnz4nAtolPjgHISSYvLPanKIFoKqkX6F7lOpeFUU`,
      },
    });
  },
});

const AppContainer = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

ReactDOM.render(<AppContainer />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

function displayNotification() {
  if (Notification.permission == "granted") {
    navigator.serviceWorker.getRegistration().then(function(reg) {
      var options = {
        body: "Here is a notification body!",
        icon: "images/example.png",
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1,
        },
        actions: [
          {
            action: "explore",
            title: "Explore this new world",
            icon: "images/checkmark.png",
          },
          {
            action: "close",
            title: "Close notification",
            icon: "images/xmark.png",
          },
        ],
      };
      reg.showNotification("Hello world!", options);
    });
  }
}
Notification.requestPermission(function(status) {
  subscribeUser();
  console.log("Notification permission status:", status);
});
displayNotification();

function subscribeUser() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then(function(reg) {
      reg.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            "BF6nRus1TBlIv4QcHvUzePyeTs4ji937UEHTsxaA-HWJnV3C271jDdqgK0cxV4KWmAC4HetEuNbGLnXenylAbNM"
          ),
        })
        .then(function(pushSubscription) {
          PostSubscriptionDetails(pushSubscription);
        })
        .catch(function(e) {
          if (Notification.permission === "denied") {
            console.warn("Permission for notifications was denied");
          } else {
            console.error("Unable to subscribe to push", e);
          }
        });
    });
  }
}
function PostSubscriptionDetails(Subscription) {
  var sub = JSON.parse(JSON.stringify(Subscription));

  var token = sub.keys.p256dh;
  var auth = sub.keys.auth;
  var fields = { endpoint: sub.endpoint, token: token, auth: auth };
  console.log(fields);
  fetch("https://localhost:4000/sign-up", {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(fields),
  }).then(function(data) {
    console.log("returned from server:");
    console.log(data);

    // Todo. Save anything you needed when you "regsitered" with the server and told him how to notify you.
  });
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}
