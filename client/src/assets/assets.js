import logo from './logo.svg'
import sample_cover from './sample_cover.jpg'
import sample_profile from './sample_profile.jpg'
import bgImage from './bgImage.png'
import group_users from './group_users.png'
import { Home, MessageCircle, Search, UserIcon, Users, Film, BarChart3 } from 'lucide-react'
import sponsored_img from './sponsored_img.png'

export const assets = {
    logo,
    sample_cover,
    sample_profile,
    bgImage,
    group_users,
    sponsored_img
}

export const menuItemsData = [
    { to: '/', label: 'Feed', Icon: Home },
    { to: '/reels', label: 'Reels', Icon: Film },
    { to: '/messages', label: 'Messages', Icon: MessageCircle },
    { to: '/connections', label: 'Connections', Icon: Users },
    { to: '/discover', label: 'Discover', Icon: Search },
    { to: '/analytics', label: 'Insights', Icon: BarChart3 },
    { to: '/profile', label: 'Profile', Icon: UserIcon },
];


export const dummyUserData = {
    "_id": "user_2zdFoZib5lNr614LgkONdD8WG32",
    "email": "arpan@example.com",
    "full_name": "Arpan Pakhira",
    "username": "arpan",
    "bio": "💻 Full-Stack Developer | 🚀 Creator of Ryzo\r\nBuilding modern web experiences.\r\n✨ Staying curious. Code & Design.",
    "profile_picture": sample_profile,
    "cover_photo": sample_cover,
    "location": "Kolkata, India",
    "followers": ["user_2", "user_3", "user_4", "user_5", "user_6"],
    "following": ["user_2", "user_3", "user_4", "user_5", "user_6"],
    "connections": ["user_2", "user_3", "user_4", "user_5", "user_6"],
    "posts": [],
    "is_verified": true,
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString(),
}

export const dummyUser2Data = {
    ...dummyUserData,
    _id: "user_2",
    username: "aakash_s",
    full_name: "Aakash Sharma",
    profile_picture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
}

export const dummyUser3Data = {
    ...dummyUserData,
    _id: "user_3",
    username: "rahul_v",
    full_name: "Rahul Verma",
    profile_picture: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&h=200&auto=format&fit=crop",
}

export const dummyUser4Data = {
    ...dummyUserData,
    _id: "user_4",
    username: "subham_d",
    full_name: "Subham Das",
    profile_picture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop",
}

export const dummyUser5Data = {
    ...dummyUserData,
    _id: "user_5",
    username: "manish_k",
    full_name: "Manish Kumar",
    profile_picture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop",
}

export const dummyUser6Data = {
    ...dummyUserData,
    _id: "user_6",
    username: "virat_k",
    full_name: "Virat Kohli",
    profile_picture: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&h=200&auto=format&fit=crop",
}

export const dummyUser7Data = {
    ...dummyUserData,
    _id: "user_7",
    username: "priya_p",
    full_name: "Priya Patel",
    profile_picture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop",
}

export const dummyStoriesData = [
    {
        "_id": "story_arpan_1",
        "user": dummyUserData,
        "content": "✨ Building new features on Ryzo! Loving the progress so far 🚀.",
        "media_url": "",
        "media_type": "text",
        "background_color": "#4f46e5",
        "createdAt": new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
        "updatedAt": new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    },
    {
        "_id": "story_aakash_1",
        "user": dummyUser2Data,
        "content": "",
        "media_url": "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
        "media_type": "image",
        "background_color": "#7c3aed",
        "createdAt": new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        "updatedAt": new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        "hotspots": [
            {
                "id": "hotspot_aakash_car",
                "x": 52,
                "y": 65,
                "type": "note",
                "title": "Secret Midnight Ride 🏎️",
                "content": "Taking this out for a midnight drive on the coastal highway! Who wants to ride shotgun? 💨🔥",
                "hint": "Tap near the front headlights ✨",
                "visibility": "shimmer"
            }
        ]
    },
    {
        "_id": "story_rahul_1",
        "user": dummyUser3Data,
        "content": "📌 Late night coding session with @arpan and @aakash_s! 💻🔥",
        "media_url": "",
        "media_type": "text",
        "background_color": "#059669",
        "createdAt": new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        "updatedAt": new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    },
    {
        "_id": "story_subham_1",
        "user": dummyUser4Data,
        "content": "",
        "media_url": "https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg",
        "media_type": "image",
        "background_color": "#ec4899",
        "createdAt": new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
        "updatedAt": new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
        "hotspots": [
            {
                "id": "hotspot_subham_team",
                "x": 48,
                "y": 45,
                "type": "photo",
                "title": "Behind-The-Scenes Polaroid 📸",
                "content": "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
                "hint": "Tap the center of the crowd 🔍",
                "visibility": "shimmer"
            }
        ]
    },
    {
        "_id": "story_manish_1",
        "user": dummyUser5Data,
        "content": "🏆 Big achievement today! Excited to share more soon.",
        "media_url": "",
        "media_type": "text",
        "background_color": "#0284c7",
        "createdAt": new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
        "updatedAt": new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    },
    {
        "_id": "story_virat_1",
        "user": dummyUser6Data,
        "content": "⚡ Hard work & dedication beat everything! Stay focused.",
        "media_url": "",
        "media_type": "text",
        "background_color": "#1e293b",
        "createdAt": new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
        "updatedAt": new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    }
]

export const dummyPostsData = [
    {
        "_id": "68773e977db16954a783839c",
        "user": dummyUserData,
        "content": "We're a small #team with a big vision — working day and night to turn dreams into products with @aakash_s and @rahul_v!",
        "image_urls": [
            "https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg"
        ],
        "post_type": "text_with_image",
        "likes_count": ["user_2", "user_3"],
        "createdAt": new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        "updatedAt": new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    },
    {
        "_id": "686e6d0407845749500c24cd",
        "user": dummyUser2Data,
        "content": "Unlock your potential—every small step counts. Shoutout to @arpan for the great work on Ryzo! 🌱✨\r\n\r\n#Motivation #GrowthMindset #DailyInspiration #StayFocused #LevelUp",
        "image_urls": [],
        "post_type": "text",
        "likes_count": ["user_2zdFoZib5lNr614LgkONdD8WG32"],
        "createdAt": new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
        "updatedAt": new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    },
    {
        "_id": "686e6b21de877d29cf02e2a7",
        "user": dummyUser3Data,
        "content": "Building cool new features with #react and #tailwind! Loving the new Ryzo UI.",
        "image_urls": [],
        "post_type": "text",
        "likes_count": ["user_4"],
        "createdAt": new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
        "updatedAt": new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    },
    {
        "_id": "686e3e47ba0cf0fecba19947",
        "user": dummyUser4Data,
        "content": "Beautiful nature landscape captured today 🏔️🌲 #nature #photography",
        "image_urls": [
            "https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg"
        ],
        "post_type": "image",
        "likes_count": ["user_2zdFoZib5lNr614LgkONdD8WG32", "user_5"],
        "createdAt": new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
        "updatedAt": new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    },
    {
        "_id": "686e39e86e0585e9e2e58dd3",
        "user": dummyUser6Data,
        "content": "Finally, got the dream car! 🚘✨ #goals #blessed",
        "image_urls": [
            "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg"
        ],
        "post_type": "text_with_image",
        "likes_count": ["user_2zdFoZib5lNr614LgkONdD8WG32", "user_2"],
        "createdAt": new Date(Date.now() - 15 * 3600 * 1000).toISOString(),
        "updatedAt": new Date(Date.now() - 15 * 3600 * 1000).toISOString(),
    }
]

export const dummyRecentMessagesData = [
    {
        "_id": "msg_recent_1",
        "from_user_id": dummyUser2Data,
        "to_user_id": dummyUserData,
        "text": "Hey Arpan! Check out the new design updates.",
        "message_type": "text",
        "media_url": "",
        "seen": true,
        "createdAt": new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        "updatedAt": new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
    {
        "_id": "msg_recent_2",
        "from_user_id": dummyUser3Data,
        "to_user_id": dummyUserData,
        "text": "Awesome job on the new story feature!",
        "message_type": "text",
        "media_url": "",
        "createdAt": new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        "updatedAt": new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        "seen": false
    }
]

export const dummyMessagesData = [
    {
        "_id": "msg_1",
        "from_user_id": "user_2",
        "to_user_id": "user_2zdFoZib5lNr614LgkONdD8WG32",
        "text": "Hey Arpan, how is the project going?",
        "message_type": "text",
        "media_url": "",
        "createdAt": new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        "updatedAt": new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        "seen": true
    },
    {
        "_id": "msg_2",
        "from_user_id": "user_2zdFoZib5lNr614LgkONdD8WG32",
        "to_user_id": "user_2",
        "text": "Going great Aakash! Just finishing the new features.",
        "message_type": "text",
        "media_url": "",
        "createdAt": new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        "updatedAt": new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        "seen": true
    }
]

export const dummyConnectionsData = [
    dummyUserData,
    dummyUser2Data,
    dummyUser3Data,
    dummyUser4Data,
    dummyUser5Data,
    dummyUser6Data,
    dummyUser7Data
]

export const dummyFollowersData = [
    dummyUser2Data,
    dummyUser3Data,
    dummyUser4Data,
    dummyUser5Data,
    dummyUser6Data
]

export const dummyFollowingData = [
    dummyUser2Data,
    dummyUser3Data,
    dummyUser4Data,
    dummyUser5Data,
    dummyUser6Data
]

export const dummyPendingConnectionsData = [
    dummyUser4Data,
    dummyUser5Data
]

export const dummyNotificationsData = [
    {
        "_id": "notif_1",
        "sender": dummyUser2Data, // Aakash
        "type": "like",
        "text": "liked your post",
        "post_id": "68773e977db16954a783839c",
        "post_preview": "https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg",
        "read": false,
        "createdAt": new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
        "_id": "notif_2",
        "sender": dummyUser3Data, // Rahul
        "type": "comment",
        "text": "mentioned you in a comment: @arpan check out the new design!",
        "post_id": "68773e977db16954a783839c",
        "post_preview": "https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg",
        "read": false,
        "createdAt": new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    },
    {
        "_id": "notif_3",
        "sender": dummyUser4Data, // Subham
        "type": "follow",
        "text": "started following you",
        "is_following_back": false,
        "read": false,
        "createdAt": new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    },
    {
        "_id": "notif_4",
        "sender": dummyUser5Data, // Manish
        "type": "story_reaction",
        "text": "reacted ❤️ to your story",
        "story_preview": "✨ Building new features on Ryzo!",
        "read": true,
        "createdAt": new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    },
    {
        "_id": "notif_5",
        "sender": dummyUser7Data, // Priya
        "type": "like",
        "text": "liked your photo",
        "post_preview": "https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg",
        "read": true,
        "createdAt": new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    },
    {
        "_id": "notif_6",
        "sender": dummyUser6Data, // Virat
        "type": "follow",
        "text": "started following you",
        "is_following_back": true,
        "read": true,
        "createdAt": new Date(Date.now() - 1 * 86400 * 1000).toISOString(),
    }
]

export const dummyHighlightsData = [
    {
        "_id": "hl_travel",
        "user_id": "user_2zdFoZib5lNr614LgkONdD8WG32", // Arpan
        "title": "Travel ✈️",
        "cover_image": "https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg",
        "stories": [
            {
                "_id": "hl_s_1",
                "user": dummyUserData,
                "content": "Exploring the majestic mountains 🏔️✨",
                "media_url": "https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg",
                "media_type": "image",
                "background_color": "#059669",
                "createdAt": new Date(Date.now() - 10 * 86400 * 1000).toISOString(),
            },
            {
                "_id": "hl_s_2",
                "user": dummyUserData,
                "content": "Sunset views by the valley 🌄",
                "media_url": "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
                "media_type": "image",
                "background_color": "#d97706",
                "createdAt": new Date(Date.now() - 9 * 86400 * 1000).toISOString(),
            }
        ]
    },
    {
        "_id": "hl_code",
        "user_id": "user_2zdFoZib5lNr614LgkONdD8WG32", // Arpan
        "title": "Code & Tech 💻",
        "cover_image": "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg",
        "stories": [
            {
                "_id": "hl_s_3",
                "user": dummyUserData,
                "content": "✨ Building full-stack web applications on React & Node!",
                "media_url": "",
                "media_type": "text",
                "background_color": "#4f46e5",
                "createdAt": new Date(Date.now() - 15 * 86400 * 1000).toISOString(),
            }
        ]
    },
    {
        "_id": "hl_vibes",
        "user_id": "user_2zdFoZib5lNr614LgkONdD8WG32", // Arpan
        "title": "Vibes 🎵",
        "cover_image": "https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg",
        "stories": [
            {
                "_id": "hl_s_4",
                "user": dummyUserData,
                "content": "Weekend coding session with great music 🎧",
                "media_url": "https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg",
                "media_type": "image",
                "background_color": "#7c3aed",
                "createdAt": new Date(Date.now() - 20 * 86400 * 1000).toISOString(),
            }
        ]
    },
    {
        "_id": "hl_gym",
        "user_id": "user_2zdFoZib5lNr614LgkONdD8WG32", // Arpan
        "title": "Gym 🏋️‍♂️",
        "cover_image": "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg",
        "stories": [
            {
                "_id": "hl_s_5",
                "user": dummyUserData,
                "content": "Consistency is key 💪 Focus on growth!",
                "media_url": "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg",
                "media_type": "image",
                "background_color": "#dc2626",
                "createdAt": new Date(Date.now() - 25 * 86400 * 1000).toISOString(),
            }
        ]
    },
    {
        "_id": "hl_aakash_1",
        "user_id": "user_2", // Aakash
        "title": "Roadtrips 🚗",
        "cover_image": "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
        "stories": [
            {
                "_id": "hl_s_6",
                "user": dummyUser2Data,
                "content": "Exploring highway drives 🚗✨",
                "media_url": "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
                "media_type": "image",
                "background_color": "#2563eb",
                "createdAt": new Date(Date.now() - 12 * 86400 * 1000).toISOString(),
            }
        ]
    }
]
