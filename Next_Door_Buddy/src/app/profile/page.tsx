import {getUser} from "#/lib/dal";
import {Button} from "#/components/ui/button";
import {redirect} from "next/navigation";
import Link from "next/link";

export default async function ProfileIndex() {
    const user = await getUser();

    if (!user) return redirect('/login');
    return (
        <div>
            <h1>Profile</h1>

            <p> This is a page only accessible if you are connected :)</p>

            <Button className={"m-5"}>Edit</Button>

            <Link href="/logout"><Button variant={"destructive"}>Logout</Button></Link>


        </div>
    )
}