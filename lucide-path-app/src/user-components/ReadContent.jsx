import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import mindfulnessImage from "../assets/how-to-talk.jpg";
import stressImage from "../assets/stress.jpg";
import modernStress from '../assets/modern-stressors.jpg';
import letsdown from '../assets/lets-you-down.jpg';
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
            title: "10 Tips for Coping with Violent and Stressful News",
            author: "By Helen Brown",
            pic: stressImage,
            body: `Acts of terror, violence, and war can be devastating and extremely difficult to understand. Even if we can’t make sense of these incidents, they can dig into our subconscious to disrupt our view of the world and make us feel threatened.

            Even if we don’t know the victims personally, such incidents can be traumatic and deeply disturbing.
            
            Typical Reactions
            When we hear about incidents of mass violence, we are confronted with a reality that can be tough to accept. These events can shake the foundation of our worldview and undermine our perceptions of justice and fairness.
            
            You may start to feel afraid or unsafe going about your usual activities, particularly if they’ve directly affected someone close to you, occurred in your community, or you have experienced trauma in the past. Other responses may include:
            
            > Numbness, shock
            > A sense of disconnection from your emotions
            > Difficulty making decisions
            > Anger toward the perpetrator
            > Inability to switch off thoughts or images of the incident
            > Tension, nervousness, or irritability
            > Difficulty connecting with others and feelings of isolation
            > Loss of appetite
            > Headaches and stomach aches
            > Anxiety, such as increased heart rate or muscle tension
            > Disturbed sleep and bad dreams
            > Worry about future mass violence

            Traumatic experiences can drain your emotional resources, and you may feel less able to cope with life’s ordinary challenges. Work problems, financial worries, or just keeping on top of your daily activities may all start to feel more stressful. Be kind to yourself while you find your feet again.
            
            It’s also important to know that if you don’t experience these reactions, that is absolutely okay. Everyone reacts differently, and on different timescales. There is no right or wrong way to respond.
            
            Look After Yourself
            If you’re experiencing any of the reactions above, it’s important to prioritize self-care. Even if the event happened far away, your body and mind can react as though you were much closer. Here are eight ways you can practice self-care:
            
            1. Tend to your body's needs—focus on eating healthy meals and getting proper rest, including sleeping well and spending time outdoors, all of which can help you feel better.
            
            2. Keep active in a way that feels comfortable, whether that's taking walks around your neighborhood, going to the gym, or doing a spin or other workout class.
            
            3. Engage in relaxation exercises such as meditation or breathwork.
            
            4. Create a consistent bedtime routine to help you relax at night.
            
            5. Gather information on available mental-health services and support.
            
            6. Avoid using alcohol or drugs to help you cope.
            
            7. Take a break from watching the news on TV and social media.
            
            8. Focus on doing things you enjoy, such as listening to music, painting, or walking—even in the wake of a tragedy, you're allowed to continue to enjoy your life.
            
            Talk it Out
            Don't be afraid to speak up and ask for help if you need it. Talking to others about how you’re feeling and the thoughts you’ve been having about the event can help lighten your load, and you may find that they're having similar experiences.
            
            If you’re supporting a loved one who is having trouble dealing with what happened, you might hesitate to seek support for yourself. But it’s just as important to look after yourself and confide in someone you trust about how you’re feeling, so you can be in a better place to support others.
            
            When we’re exposed to violence and brutality, even indirectly, our brains begin working overtime to find meaning in it all. Although we may never find the answers, we question who is to blame and how this could possibly have happened.
            
            Continuing to speak with friends, family, and people within your faith community can help you begin making sense of the incident. Even if you don’t reach any clear conclusions, the process of talking and meaning-making with others can be restorative in itself.
            
            Get Help
            Dealing with complex feelings of grief, trauma, and anxiety can be incredibly difficult. Seeking out emotional support and sharing your experiences with others can help you feel less alone.
            
            If you’re worried about mental or physical problems that have arisen, don’t hesitate to speak to your doctor or mental health professional.`
        },
        { 
            title: "Protect Your Peace from Modern Stressors",
            author: "By Marisa Cohen",
            pic: modernStress,
            body: `A few months ago, I joined an app that was designed to connect real-life neighbors online. I was hoping to get the inside scoop on new restaurants and maybe catch some local gossip.

            Instead, I got exactly one good tip about a new ice cream shop—and a ton of aggravation. One neighbor's complaint about a panhandler quickly touched off a no-holds-barred, ALL-CAPS debate about mental health policies in our city. Soon, even harmless questions about parking spots somehow degenerated into vicious screeds complete with NSFW language and name-calling. Within weeks, I deleted the app.
            
            The Connectivity Conundrum
            Being constantly connected to friends, family, neighbors, and the world at large has a lot of benefits. But the advent of social media and 24/7 technology has also brought about more and more ways to drive us crazy.
            
            Every time your phone buzzes or you check Facebook, it seems like someone is out to scam you or start an argument. “Technology has made it easier for people to access groups and information that's often upsetting or polarizing in nature,” says psychologist Carla Marie Manly, Ph.D., author of Joy from Fear.
            
            Reclaim Your Calm
            Manly says that by using calming strategies, you can stay engaged with the techno world without losing your sanity. Here are four very 21st-century aggravations and how to deal:
            
            1. Online Trolls
            How often do you scroll Instagram or read a news article and feel your head explode from reading the vicious comments? I’ve even seen my own posts turn into screaming matches between friends of mine who would probably like each other if they met in real life.
            
            When you feel your blood starting to boil from an online troll, “start by acknowledging how you feel and clarify the thought that led to it,” says Joel Minden, Ph.D., author of Show Your Anxiety Who’s Boss. “Anger is often driven by the belief that you’re being disrespected or treated unfairly.”
            
            You could, of course, just scroll on by. But if you feel compelled to respond, Minden suggests a few questions to consider: “Is it important to reply and correct a false impression? Or will you end up feeling even more upset after getting involved in an unproductive back-and-forth with a stranger who isn’t interested in a good-faith discussion?”
            
            In the end, the most useful way to deal with trolls is to remember that you're not required to respond at all—simply step away from the phone or computer, take some deep breaths or do another calming ritual, and remind yourself that by ignoring the troll, you're depleting them of their power.
            
            2. Robocalls
            "This is Robin from dealer services…” Is there a person alive who hasn't received one (or 1,000) of these enraging phone calls? In fact, more than 50 billion robocalls are placed each year, most of them aiming to scam you (or, more likely, your elderly relatives) out of your hard-earned money. But other than never answering your phone again, what can you do?
            
            First, try the practical approach: Download a call-blocking app; let any calls from unknown numbers go directly to voicemail; and when a robocall does sneak through, hang up immediately without saying a word.
            
            But Manly suggests one more thing: “It’s helpful to intentionally smile when hanging up on these calls,” she says, adding that research suggests that the physical act of smiling is a simple way to release stress. Then picture the spam calls and texts as tiny flies that you can easily swat away. “They’re bothersome, but we really don’t want to waste very much energy on them,” she says.
            
            3. Fake Pop-Up Ads
            I like to think of myself as a savvy consumer, researching every site carefully before I hit the Pay Now button. But one night I was up late scrolling through my social feed when an ad popped up for a Jane Austen–themed jigsaw puzzle. How did they know that was exactly what I wanted? I clicked on the ad and bought two puzzles before I had a chance to think it through.
            
            The next morning, once it dawned on me what I'd done, a mild panic set in. Had I been ripped off? Of course, it was a scam, and no puzzles ever arrived.
            
            Though puzzleless, I did learn a few lessons: Never buy anything on a whim in the middle of the night. Never click on a pop-up ad—instead, if you’re interested in the product, open a new window and search for it on a legit e-commerce site. And always use a well-established payment app—because I used PayPal, my purchase was protected, and I eventually got the money back.
            
            But perhaps the best way to both stay calm and avoid scams is to make a practice of stopping and taking a mandatory 15–minute cooling-down period before you make any impulse purchases online.
            
            4. Neighborhood Apps
            As I discovered, neighbors who might smile at each other at the grocery store can turn into raving banshees when unleashed anonymously online. But while it’s easy to get sucked in by the carnival sideshow, Manly says it's possible to skip past that and get to the good stuff on neighborhood apps.
            
            “By knowing what you want from the site—such as a referral for a great restaurant or pet sitter—you can purposefully avoid the often small-minded commentary that tends to be upsetting and deflating,” she says. “We’re far less likely to get hooked by negative interactions when we mindfully pop online for a specific purpose, get the information we need, and then turn our attention elsewhere.”
            
            In other words, there is no rule that you have to read the bad stuff to get to the good. Just like in real life, you can choose your neighbors wisely.` 
        },
        { 
            title: "What to Do When a Loved One Lets You Down",
            author: "By Homaira Kabir",
            pic: letsdown,
            body: `We've all been let down by others at some point in our lives. A friend promises to join you for an outing and doesn’t show up. A colleague doesn't speak up for you in front of your boss. A superior takes all the credit for your hard work. It makes us angry, frustrated, and hurt. But more often than not, it simply confirms the story about them that we have running in our minds.

            The pain goes much deeper when a loved one lets us down. It can feel as though the rug has been pulled out from under us, as though our mental stories have been completely shattered. This is because we see ourselves through the eyes of our closest relationships, and we make sense of our lives through their actions. When your child, parent, or partner is caught lying to you, or when you find out things about them that you find hard to believe, it pulls you apart at your very core.
            
            I recently sat with a friend who'd just found out that her child had been caught engaging in substances and behaviors that she'd never thought possible. She said she felt razed to her bones—that nothing else mattered. I knew the feeling, for the journey of parenthood never promised anyone a bed of roses.
            
            I also know that as we grapple to make sense of things, it's easy to panic or to want to hide away—two in-built responses of the more primitive parts of our brain. But this is exactly when we need our presence to be the most awake, aware, and attentive.
            
            This can feel overwhelming, which is why a process that puts together the pieces of your sense of self is so helpful in rebuilding your trust in others (and life) once again.
            
            Physiological: Steady Your Breath
            The body responds to outside threats even before we've had a chance to make sense of them. I've often seen myself be startled by a faint shuffle in the bushes during my morning walk, even before I've realized that it may have been a snake. The physiological responses that help us deal with the threat—the release of hormones, the rush of blood to the limbs, an accelerated heart rate, and, yes, shallow and quickened breathing, are all largely subconscious and beyond our control. The one exception is the breath. Managing it through long, slow exhalations sends our body the message that all is safe, and allows us to access the higher cognitive parts of our brain.
            
            Emotional: Feel Your Emotions
            It’s hard to sit with painful emotions. We're wired to want to run away from pain and approach pleasure—which is why it’s far more instinctive to want to distract ourselves in ways that feel good in the moment, but do little to ease the hurt once we're back in our own company. It can also lead to self-destructive behaviors to get rid of the pain, or numb it in some way. Body scans and self-compassion practices are excellent ways to embrace the pain, feel it in our bodies, understand its intensity and desire, and give it the space to just be, trusting that all it wants is a temporary safe place to feel understood.
            
            Cognitive: Watch Your Thoughts
            Listen to the thoughts that emerge. It’s easy to get attached to them and run along with their story. But this will not help, because your mind will only look for ways to confirm your thought and strengthen its story. "They don’t really care," "I was a fool to believe them," and "They love someone else" are all stories that may be partially true, but cannot be the whole truth. It's only when we detach ourselves from the stories that are running through our minds that we open up to the larger truth that is always more expansive and open to forgiveness. A practice that I find particularly helpful is to watch my thoughts like clouds that appear but then float away.
            
            Behavioral: Decide What's Needed
            It's almost impossible for anyone to tell you how to respond if you've been let down by someone you love. But when you practice the three steps above, you'll be able to distance yourself from an emotional reaction and allow your wisdom to guide you to the most compassionate and courageous response. This does not mean you need to forgive if you're not ready. Nor does it require you to instantly let go of what happened and move on. Every situation is different. Listen to your head and heart, and you'll know whether you need to distance yourself for a while, or reach out to them so that together, you reset the foundations for a healthy relationship.
            
            Life is sometimes painful, and relationships are often hard. The journey will be rough in places, and our hearts will be broken more than once. But if you learn to connect back in, you'll find, as author and educator Parker Palmer says, that your heart will be broken open, not broken apart.` 
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
