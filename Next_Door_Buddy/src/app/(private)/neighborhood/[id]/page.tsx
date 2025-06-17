import React from 'react'
import { Card, CardContent } from '#/components/ui/card'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Avatar, AvatarImage } from '#/components/ui/avatar'
import { ScrollArea } from '#/components/ui/scroll-area'
import { Search } from 'lucide-react'

const NeighborhoodCommunityPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const NeighborhoodId = decodeURIComponent(React.use(params).id)


    return (
        <div className="flex bg-[#0F0F2D] min-h-screen text-gray-800">
            {/* Sidebar */}
            <div className="w-1/5 bg-[#F1F1F1] p-6 flex flex-col items-center gap-6">
                <h1 className="text-3xl font-bold text-black">Paris</h1>
                <div className="flex flex-col gap-4 w-full items-center mt-4">
                    <Button variant="secondary" className="w-full">Local newsletter</Button>
                    <Button variant="secondary" className="w-full">Chat</Button>
                    <Button variant="secondary" className="w-full">Information</Button>
                    <Button variant="secondary" className="w-full">Leave</Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 bg-white">
                {/* Top Bar */}
                <div className="flex items-center gap-4 mb-6">
                    <Avatar>
                        <AvatarImage src="https://via.placeholder.com/40" />
                    </Avatar>
                    <Input
                        placeholder="What do you want to share ?"
                        className="flex-1"
                    />
                    <Button variant="outline">Offer a service</Button>
                    <Button variant="outline">Trade</Button>
                    <Button variant="outline">Propose an excursion</Button>
                    <Button>Post</Button>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between border-b pb-2 mb-4">
                    <div className="flex gap-6 font-medium">
                        <span className="border-b-2 border-blue-500 pb-1">All</span>
                        <span>Service</span>
                        <span>Trocs</span>
                        <span>Excursion</span>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <Input className="pl-8" placeholder="Rechercher" />
                    </div>
                </div>

                {/* Post */}
                <Card className="mb-6">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-medium">Jean-Marie Valheur · Dec 17</div>
                            <Button variant="outline" size="sm">Excursion</Button>
                        </div>
                        <h2 className="mt-2 font-semibold text-lg">
                            What are some of the most interesting scientific facts known to you?
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Sixteen years ago, a man named Fimme Bootsma was struck with a brain aneurysm
                            that left him severely handicapped... his short-term memory was gone almost
                            entirely — after just thirty minutes, he would forget everything he was told, <span className="text-blue-500">(more)</span>
                        </p>
                        <img
                            src="https://images.unsplash.com/photo-1570129477492-45c003edd2be"
                            alt="Excursion"
                            className="w-full rounded-lg mt-4"
                        />
                        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                            <span>👍 Upvote · 7.3K</span>
                            <span>💬 279</span>
                            <span>👀 270</span>
                            <Button size="sm">Join the outing</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Community Member List */}
            <div className="w-1/5 bg-[#F9F9F9] p-6">
                <h2 className="font-semibold text-lg mb-4">Community member</h2>
                <ScrollArea className="h-[calc(100vh-100px)] pr-2">
                    {['Ralph Edwards', 'Cody Fisher', 'Jane Cooper', 'Theresa Webb', 'Bessie Cooper', 'Albert Flores', 'Kathryn Murphy'].map((name, i) => (
                        <div key={i} className="flex items-center gap-3 mb-4">
                            <Avatar>
                                <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 1}`} />
                            </Avatar>
                            <div>
                                <p className="font-medium text-sm leading-none">{name}</p>
                                <p className="text-xs text-muted-foreground">Present depuis 1 mois</p>
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </div>
        </div>
    )
}

export default NeighborhoodCommunityPage
