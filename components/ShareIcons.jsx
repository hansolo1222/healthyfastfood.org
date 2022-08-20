import { SocialIcon } from "react-social-icons";

import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  PinterestShareButton,
  RedditShareButton,
  TelegramShareButton,
  LinkedinShareButton,
  HatenaShareButton,
  InstapaperShareButton,
  LineShareButton,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
} from "react-share";

export const ShareIcons = ({size, align}) => {
    let url = "https://healthyfastfood.org"
    let justify
    if (align == 'left'){
        justify = 'justify-start'
    } else if (align == 'center'){
        justify = 'justify-center'
    } 
  return (
    <div className={`${justify} flex space-x-3`}>
      <FacebookShareButton url={url}>
        <SocialIcon network="facebook" style={{ height: size, width: size }} />
      </FacebookShareButton>
      <TwitterShareButton url={url}>
        <SocialIcon network="twitter" style={{ height: size, width: size }} />
      </TwitterShareButton>
      <PinterestShareButton url={url}>
        <SocialIcon network="pinterest" style={{ height: size, width: size }} />
      </PinterestShareButton>
      <RedditShareButton url={url}>
        <SocialIcon network="reddit" style={{ height: size, width: size }} />
      </RedditShareButton>
      <TelegramShareButton url={url}>
        <SocialIcon network="telegram" style={{ height: size, width: size }} />
      </TelegramShareButton>
      <EmailShareButton url={url}>
        <SocialIcon network="email" style={{ height: size, width: size }} />
      </EmailShareButton>
    </div>
  );
};
