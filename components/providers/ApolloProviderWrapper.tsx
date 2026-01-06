"use client";

import { ReactNode } from "react";

import { ApolloProvider } from "@apollo/client/react";

import client from "@/lib/apollo";

type Props = {
  children: ReactNode;
};

export default function ApolloProviderWrapper({ children }: Props) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
