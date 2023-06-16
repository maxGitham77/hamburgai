import {getSession, withPageAuthRequired} from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";

export default withPageAuthRequired(async function handler(req, res) {
	try {
		const { user: {sub} } = await getSession(req, res);
		const client = await clientPromise;
		const db = client.db("hamburg_ai");
		const userProfile = await db.collection("users").findOne({
			auth0Id: user.sub
		});
		
		const { lastPostDate } = req.body;
		
		const posts = await db.collection("posts").find({
			userId: userProfile._id,
			created: {$lt: new Date(lastPostDate)}
		})
			.limit(5)
			.sort({ created: -1})
			.toArray()
		
		res.status(200).json({posts});
		return;
	} catch (e) {
	
	}
})