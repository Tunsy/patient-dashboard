"use client";
import { ApolloProvider } from "@apollo/client";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
    const client = new ApolloClient({
        link: new HttpLink({
        uri: "http://localhost:8000/graphql",
        }),
        cache: new InMemoryCache(),
    });

    return <ApolloProvider client={client}>{children}</ApolloProvider>;
}