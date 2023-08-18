//ForConfirmRootsListModule.ts

export function createUrlForConfirmRoots(
  startUrl: string,
  rootStartsWith: string | null | undefined,
  createdUserName: string | null | undefined
) {
  let newUrl = startUrl;
  let questionMarkAdded = false;
  if (rootStartsWith) {
    if (!questionMarkAdded) {
      newUrl += "?";
      questionMarkAdded = true;
    }
    newUrl += `rootStartsWith=${rootStartsWith}`;
  }
  if (createdUserName && createdUserName !== "ყველა") {
    if (!questionMarkAdded) newUrl += "?";
    else newUrl += "&";
    newUrl += `createdUserName=${createdUserName}`;
  }
  return newUrl;
}
