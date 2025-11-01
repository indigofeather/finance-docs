"use client";

import { Adsense as Ads } from "@ctrl/react-adsense";

export const InArticleAd = () => {
  return (
    <Ads
      client="ca-pub-2574426828037254"
      slot="7530310275"
      style={{ display: "block", textAlign: "center" }}
      layout="in-article"
      format="fluid"
    />
  );
};

export const MediaAd = () => {
  return (
    <Ads
      client="ca-pub-2574426828037254"
      slot="4088670977"
      style={{ display: "block", textAlign: "center" }}
      format="auto"
      responsive="true"
    />
  );
};

export const MultiplexAd = () => {
  return (
    <Ads
      client="ca-pub-2574426828037254"
      slot="6243980075"
      style={{ display: "block", textAlign: "center" }}
      format="autorelaxed"
      responsive="true"
    />
  );
};
