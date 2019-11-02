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
