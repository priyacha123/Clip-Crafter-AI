import Link from "next/link";
import { Button } from "../../../components/ui/button";

export const EmptyState = () => {
  return (
    <div className="flex flex-col m-20 p-20 justify-center gap-5 border-2 items-center">
        <h2>You don't have any short video created</h2>
        <Link href={'/dashboard/create-new'}>
        <Button>Create New Short Video</Button>
        </Link>
    </div>
  )
}
