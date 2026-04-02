export type PathMap = {
  url: string;
  appId: string;
};

export const pathMap: PathMap[] = [
  {
    appId: "1",
    url: "/",
  },
];

export const getPathByAppId = (appId: string): PathMap => {
  const path = pathMap.find((p) => p.appId === appId);
  return path || pathMap[0];
};

export const getPathByUrl = (url: string): PathMap => {
  const path = pathMap.find((p) => p.url === url);
  return path || pathMap[0];
};
