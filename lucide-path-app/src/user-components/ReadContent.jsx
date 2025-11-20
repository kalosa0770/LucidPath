import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import mindfulnessImage from "../assets/how-to-talk.jpg";
const ReadContent = () => {
    const { title } = useParams();
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowContent(true), 500);
        return () => clearTimeout(timer);
    }, []);

    if (!showContent) {
        return (
            <div className="flex items-center justify-center h-full min-h-screen">
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
            </div>
        );
    }

    // All your article content
    const content = [
        { 
            title: "How to Use Small Talk to Connect More at Work", 
            author: "By Christine Macahilig",
            pic: mindfulnessImage,
            body: `
            If you’ve ever had a long elevator ride with a co-worker you only had a nodding acquaintance with or been the new face at a networking event, you know that making casual conversation isn’t easy. Many of us dread the awkward struggle to think of something—anything—to say, so much that we avoid having to talk with near-strangers like the plague.

                But what if sidestepping small talk means you’re bypassing the chance to add a little lift to your day? Studies suggest that those little moments of casual conversation can be beneficial to your well‑being and increase your sense of belonging.

                Why Making Small Talk Is So Hard
                One thing that makes small talk so challenging is that many of us lack confidence in our ability to hold a conversation. In one study, participants downgraded their conversational abilities and blamed themselves rather than find fault with the other person if the conversation itself was going poorly.

                “Part of why the pessimism is so sticky is because it’s hard to get feedback about informal conversations,” says Christopher Welker, co-author of the study. “It’s up to you and, in large part, your conversation partner to decide how well your interaction went.”

                And even though we find making small talk difficult, it’s the conversational mode we tend to operate in. One study suggests that although we prefer to engage in deeper, more meaningful conversation, we default to shallow chitchat because we don’t think others would be interested in getting to know us better.

                “When people are interacting with someone new, there’s some uncertainty about how caring the other person would be during a conversation,” says Michael Kardas, a co-author of the study and an assistant professor of management at Oklahoma State University’s Spears School of Business.

                One way to get past that initial small-talk awkwardness is to think of it as just a conversational opener. “Once you reveal something about yourself, other people tend to be very interested, and this leads the conversation to be less awkward and more enjoyable than people expect it to be,” Kardas says.

                How to Master the Art of Making Small Talk
                Instead of being intimidated by your next chance encounter, use these tips to get better at making small talk—and learn how to turn it into a gateway to more meaningful conversation.

                Focus On the Other Person
                One way to lessen your discomfort is to get out of your head and shift your attention to the other person.

                “People who are uncomfortable with small talk more often see the content as more important than the connecting part,” says Mark Goulston, M.D., author of Just Listen: Discover the Secret to Getting Through to Absolutely Anyone. “The awkwardness often comes from being more self-absorbed than other-focused.”

                Engage your curiosity, ask questions, and take the time to listen to the answers. When you make learning something new about the other person the goal, you worry less about what you’re going to say. They may even feel flattered that you have taken an interest in them.

                Use Small Talk as a Starting Point
                Small talk may feel like it doesn’t come with any added value, but it can be a gateway to a deeper conversation. After asking how someone’s day is going, build toward more meaningful conversation by finding common ground.

                “You might start chatting and not say anything particularly meaningful at the start of the exchange, but once you’re talking, it can open up a deeper conversation,” Kardas says. “Small talk can be the start of what turns into a more meaningful exchange.”

                Look for Opportunities to Reach Out
                Spend the first few minutes of a meeting doing a fun icebreaker and then take the conversation a step further, after the meeting, by messaging co-workers over chat to learn more about their hobbies, or that recipe they said they tried the other night and loved. It creates a chance to make small talk more meaningful and less uncomfortable when you have something to start with.

                If your company works remotely, you can still find moments to connect. Find an activity that you and your remote co-worker can do together. “Chat with a remote colleague while you both are taking a walk,” suggests Welker. “Doing an activity simultaneously might better mimic the feeling of those casual conversations than a Zoom happy hour, which feels more structured and intentional.”

                The bottom line is that putting yourself out there when it comes to talking with others can help turn that nodding acquaintance into a new friend.
            `
        },
        { 
            title: "The Best Way to Get Through a Tough Day",
            body: "Full content for Tough Day article..." 
        },
        { 
            title: "Depression",
            body: "Full content for Depression article..." 
        },
        { 
            title: "All in one",
            body: "Full content for All in one article..." 
        },
    ];

    // Find the article that matches the URL
    const article = content.find(item => item.title === title);

    if (!article) {
        return (
            <div className="p-5 text-red-600">
                <h1 className="text-2xl font-bold">Article not found</h1>
            </div>
        );
    }

    return (
        <div className="md:p-50 p-10 text-teal bg-white min-h-screen items-center justify-center">
            <h1 className="text-2xl font-bold mb-3">{article.title}</h1>

            {article.author && (
                <p className="text-lg font-semibold mb-4">{article.author}</p>
            )}

            {article.pic && (
                <img src={article.pic} alt={article.title} className="w-full h-auto mb-4 rounded" />
            )}

            <p className="leading-relaxed text-gray-700 whitespace-pre-line">
                {article.body}
            </p>
        </div>
    );
};

export default ReadContent;
