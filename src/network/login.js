import {request} from "./request";

export function getLoginHome(usernames, passwords) {
  return request({
    url: '/home',
    params: {
      usernames,
      passwords
    }
  })
}



