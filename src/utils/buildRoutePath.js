export function buildRoutePath(path) {
  const routeParamatersRegex = /:([a-zA-Z]+)/g; //Regex to Capture the :id
  const pathWithParams = path.replaceAll(
    routeParamatersRegex,
    '(?<$1>[a-z0-9-_]+)',
  ); //Replace the selected part, if there is one, for another Regex, to catch all the route path

  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`); //Utilizes the pathRegex to get all the params, if there is one\
  return pathRegex;
}
