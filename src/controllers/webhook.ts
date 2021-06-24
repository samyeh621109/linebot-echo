import express from 'express';
import {
  middleware,
  JSONParseError,
  SignatureValidationFailed,
  Client,
} from '@line/bot-sdk';
import getGlobalConfig from '../config/getGlobalConfig';

const {
  channelAccessToken = 'v63eO0pn/0PN7ItE31RG7/alzsf96eol5s/KLpOFySD72+egcgRCVbOiIt8ONpf1I2Qyg0Lv+dU9JgThZo5S7eCI+k0nUf1wRhsnz11au/7fXQv95xLoZYwUBas8HPuBO/SMy9c+C0Tj/Ny3RebjQgdB04t89/1O/w1cDnyilFU=',
  channelSecret = '1ca33b7f25ac5621c99b1b9930d1f620',
} = getGlobalConfig();
const lineClient = new Client({ channelAccessToken, channelSecret });
const router = express.Router();
const authMiddleware: express.ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof SignatureValidationFailed) {
    return res.status(401).send(err.signature);
  }
  if (err instanceof JSONParseError) {
    return res.status(400).send(err.raw);
  }
  next(err);
}

router.use(middleware({ channelAccessToken, channelSecret }))
router.use(authMiddleware);
router.post('*', async (req, res) => {
  const [event] = req.body.events;
  lineClient.replyMessage(
    event.replyToken,
    {
      type: 'text',
      text: '12345'
    }
  );
});

export default router;
