export const mapRedirects = (redirects) => {
  return redirects
    .map((redirect) => {
      let querys = [];
      if (redirect?.query) {
        for (let key in redirect?.query) {
          querys.push({
            type: "query",
            key: key,
          });
        }
      }

      let cookies = [];
      if (redirect?.conditions?.Cookie) {
        const netlifyCookie = redirect?.conditions.Cookie;
        netlifyCookie.forEach((cookie) => {
          cookies.push({
            type: "cookie",
            key: cookie,
            value: "*",
          });
        });
      }

      if (redirect.to)
        return {
          source: redirect.from.replace("*", "(.*)"),
          destination: redirect.to.replace("*", "(.*)"),
          ...([...querys, ...cookies].length > 0 && {
            has: [...querys, ...cookies],
          }),
          ...(redirect.status !== 200 && {
            permanent: redirect.status === 301 || !redirect.status,
          }),
        };
    })
    .filter((x) => {
      return x !== undefined;
    });
};
