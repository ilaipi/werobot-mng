import isEmpty from 'lodash/isEmpty';

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === 'undefined' ? localStorage.getItem('antd-pro-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority || ['admin'];
}

export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
}

const filterMenu = (menu, mapping) => {
  const currentPath = menu.path;
  if (!menu.routes) return mapping[currentPath] && menu;
  const filtered = { ...menu };
  filtered.routes = [];
  menu.routes.forEach(child => {
    const filteredChild = filterMenu(child, mapping);
    if (filteredChild) filtered.routes.push(filteredChild);
  });
  if (isEmpty(filtered.routes)) return '';
  return filtered;
};

export const filterRoutes = (routes, privileges) => {
  const filteredMenus = [];
  routes.forEach(menu => {
    const filtered = filterMenu(menu, privileges);
    if (filtered) filteredMenus.push(filtered);
  });
  return filteredMenus;
};
