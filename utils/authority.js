// use localStorage to store the authority info, which might be sent from server in actual project.

export function getAuthority() {
  return localStorage.getItem('authority');
}
export function setAuthority(roles) {
  if(roles){
    const authority = [];
    roles.forEach(item => {
      authority.push(item.permissionCode);
    });
    return localStorage.setItem('authority', authority);
  }
}
