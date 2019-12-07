import {Router, Request, Response, NextFunction} from "express";



interface RequestWithBody extends Request{
    body: {[key:string]: string |undefined}
}

function requireAuth(req:Request, res: Response, next:NextFunction){
    if(req.session && req.session.loggedIn){
        return next();
        return;
    }
    res.status(403);
    res.send('Not permitted');

}


const router = Router();

router.get('/login', (req: Request, res: Response)=>{
    res.send(`
    <form method="Post">
        <div>
            <label for="email">Email</label>
            <input type="text" name="email" />
        </div>
        <div>
            <label for="password">Password</label>
            <input type="text" name="password" />
        </div>
        <button>Submit</button>
    </form>
    `);
});

router.post('/login',(req:RequestWithBody, res:Response)=>{
    const {email, password} = req.body;

    if(email && password && email==='caglaror@gmail.com' && password==='123'){
        // logged in
        req.session = {loggedIn:true};
        // redirect
        res.redirect('/');
    }else{
        res.send(`
                        Invalid email or password.
                        <br><a href="/login">Login</a>

`);
    }
});

router.get('/', (req:Request, res: Response)=>{
    if(req.session && req.session.loggedIn){
        res.send(`<div>
        <div>You are logged in!</div>
        <a href="/logout">Logout</a>
</div>`);
    }else{
        res.send(`<div>
        <div>You are not logged in!</div>
        <a href="/login">Login</a>
</div>`);
    }
});


router.get('/logout',(req:Request, res: Response)=>{
    req.session = undefined;
    res.redirect('/');
})


router.get('/protected', requireAuth, (req: Request, res:Response)=>{
   res.send(`Wellcome to protected route.
   <a href="/logout">Logout</a>
   `);

})
export{ router};
