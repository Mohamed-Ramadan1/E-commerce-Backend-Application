import { Router, Request, Response } from 'express';

const router: Router = Router();

router.get('/example3', (req: Request, res: Response) => {
  res.send('This is the /example3 route!');
});

export default router;
