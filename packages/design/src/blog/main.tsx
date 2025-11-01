import { useBlogPosts } from "@/utils/api/queries"
import { isDashboard } from "./utils/isDashboard"
import { useParams } from "react-router-dom"

export default function Blog() {
    const { id } = useParams();
    const dashboard = isDashboard()
    const posts = useBlogPosts(id!)
    return (
        <div className="">
            {dashboard ? "dashboard" : ""}
            {posts.data?.length}
        </div>
    )
}