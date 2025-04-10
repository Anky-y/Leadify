"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DiscordLogo, FacebookLogo, InstagramLogo, TwitterLogo, YoutubeLogo, EnvelopeSimple } from "./social-icons"
import { ExternalLink, Eye, EyeOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import type { TwitchData } from "./types"

interface TwitchDataTableProps {
  data: TwitchData[]
  subscribed: boolean
}

export default function TwitchDataTable({ data, subscribed }: TwitchDataTableProps) {
  // State to track which emails are revealed
  const [revealedEmails, setRevealedEmails] = useState<Record<string, boolean>>({})

  // Toggle email visibility for a specific row
  const toggleEmailVisibility = (id: string) => {
    setRevealedEmails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Username</TableHead>
              <TableHead className="text-right">Followers</TableHead>
              <TableHead className="text-right">Viewers</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Social Media</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No data found. Try adjusting your search or filters.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{row.username}</span>
                      <a
                        href={row.channelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline flex items-center mt-1"
                      >
                        View Channel
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{row.followers.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.viewers.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{row.language}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{row.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      {row.discord && (
                        <a
                          href={subscribed ? row.discord : "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${subscribed ? "text-gray-500 hover:text-indigo-600" : "text-gray-300 cursor-not-allowed"}`}
                          title={subscribed ? "Discord" : "Upgrade to view"}
                          onClick={(e) => !subscribed && e.preventDefault()}
                        >
                          <DiscordLogo className="h-4 w-4" />
                        </a>
                      )}
                      {row.youtube && (
                        <a
                          href={row.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-red-600"
                          title="YouTube"
                        >
                          <YoutubeLogo className="h-4 w-4" />
                        </a>
                      )}
                      {row.twitter && (
                        <a
                          href={row.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-blue-400"
                          title="Twitter"
                        >
                          <TwitterLogo className="h-4 w-4" />
                        </a>
                      )}
                      {row.facebook && (
                        <a
                          href={subscribed ? row.facebook : "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${subscribed ? "text-gray-500 hover:text-blue-600" : "text-gray-300 cursor-not-allowed"}`}
                          title={subscribed ? "Facebook" : "Upgrade to view"}
                          onClick={(e) => !subscribed && e.preventDefault()}
                        >
                          <FacebookLogo className="h-4 w-4" />
                        </a>
                      )}
                      {row.instagram && (
                        <a
                          href={subscribed ? row.instagram : "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${subscribed ? "text-gray-500 hover:text-pink-600" : "text-gray-300 cursor-not-allowed"}`}
                          title={subscribed ? "Instagram" : "Upgrade to view"}
                          onClick={(e) => !subscribed && e.preventDefault()}
                        >
                          <InstagramLogo className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {row.email ? (
                      subscribed || revealedEmails[row.id] ? (
                        <div className="flex items-center">
                          <a href={`mailto:${row.email}`} className="text-blue-600 hover:underline flex items-center">
                            <EnvelopeSimple className="h-4 w-4 mr-1" />
                            <span className="text-xs">{row.email}</span>
                          </a>
                          {!subscribed && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 ml-1"
                              onClick={() => toggleEmailVisibility(row.id)}
                              title="Hide email"
                            >
                              <EyeOff className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className="text-gray-400 text-xs blur-sm select-none">
                            {row.email.replace(/./g, "•")}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-1"
                            onClick={() => toggleEmailVisibility(row.id)}
                            title="Reveal email (free users get 3 reveals per day)"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      )
                    ) : (
                      <span className="text-gray-400 text-xs">Not available</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
