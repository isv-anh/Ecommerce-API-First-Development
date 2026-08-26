from app.config import settings
from langchain_openai import ChatOpenAI

from app.tools.get_policy import get_policy


llm = ChatOpenAI(
    model=settings.DEFAULT_MODEL,
    temperature=settings.TEMPERATURE,
    api_key=settings.DASHSCOPE_API_KEY_AGENT_2,
    base_url="https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
)

tools = [get_policy]

support_agent = llm.bind_tools(tools)