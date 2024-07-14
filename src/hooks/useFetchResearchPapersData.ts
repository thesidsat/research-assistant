import {ResearchPaperSummaries} from "../containers/types/types";
import {useEffect, useState} from "react";

export const useFetchResearchPapersData = (searchTerm: string, shouldFetch: boolean) => {
    const [data, setData] = useState<ResearchPaperSummaries>({ results: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            await new Promise(resolve => setTimeout(resolve, 3000));
            try {
                const response = {"results":[{"id":"26f970e4-d1bd-4a4c-905b-ee3b65f91545","title":"Towards Vision Enhancing LLMs: Empowering Multimodal Knowledge Storage and Sharing in LLMs","authors":"Yunxin Li, Baotian Hu, Wei Wang, Xiaochun Cao, Min Zhang","published":"2023-11-27","summary":"Title: Towards Vision Enhancing LLMs: Empowering Multimodal Knowledge Storage and Sharing in LLMs\nAuthors: Yunxin Li, Baotian Hu, Wei Wang, Xiaochun Cao, Min Zhang\nPublished: 2023-11-27\n\n**Summary:**\n\n1. **Main Objective**:\n   The paper aims to enhance large language models (LLMs) by integrating multimodal knowledge, allowing them to effectively utilize visual information to improve overall performance, a concept introduced as Vision Enhancing LLMs.\n\n2. **Key Innovation**:\n   The authors propose a novel approach called MKS2 (Multimodal Knowledge Storage and Sharing), which incorporates visual memory and knowledge into LLMs. The key innovation includes the Modular Visual Memory and a soft Mixtures-of-Multimodal Experts architecture.\n\n3. **Methodology**:\n   - **Modular Visual Memory**: Integrated into LLMs to efficiently store and manage open-world visual information.\n   - **Mixtures-of-Multimodal Experts**: A soft architecture within LLMs designed to enable collaboration and leveraging of multimodal knowledge during the text generation process.\n   - Comprehensive experiments were conducted to assess the ability of MKS2 to enhance reasoning capabilities and performance on multimodal benchmarks.\n\n4. **Principal Findings**:\n   MKS2 significantly improves the reasoning abilities of LLMs in tasks that require physical or commonsense knowledge. The method also achieves competitive results on multimodal benchmarks, demonstrating its effectiveness.\n\n5. **Implications for the Field**:\n   This research highlights the potential of merging visual information with LLMs to create more intelligent and capable multimodal models. The introduction of MKS2 may pave the way for future advancements in multimodal AI, enhancing the ability of LLMs to understand and generate contextually rich, multimodal responses."},{"id":"25fac933-cf63-44ff-821a-902f1d6a1900","title":"MM-LLMs: Recent Advances in MultiModal Large Language Models","authors":"Duzhen Zhang, Yahan Yu, Jiahua Dong, Chenxing Li, Dan Su, Chenhui Chu, Dong Yu","published":"2024-05-28","summary":"The paper titled \"MM-LLMs: Recent Advances in MultiModal Large Language Models\" by Duzhen Zhang et al. aims to provide a comprehensive survey on the recent advancements in MultiModal Large Language Models (MM-LLMs). \n\nMain Objective: The primary goal is to facilitate further research in MM-LLMs by offering a thorough review of the field, including design formulations, a taxonomy of existing models, performance evaluations, and training strategies.\n\nKey Innovation: The significant innovation discussed is the augmentation of off-the-shelf LLMs to support multimodal inputs and outputs through cost-effective training methods, thereby enhancing the models' capabilities for diverse MM tasks while preserving their inherent reasoning and decision-making abilities.\n\nMethodology: The authors initially outline general design principles for model architecture and training pipelines. They then categorize 126 MM-LLMs based on specific formulations, review their performance on mainstream benchmarks, and summarize key training practices that augment the potency of MM-LLMs.\n\nPrincipal Findings: The survey finds that despite substantial advancements, there remains significant room for improvement in MM-LLMs. The paper also identifies key training recipes and innovative approaches that have led to enhanced performance in various downstream tasks.\n\nImplications for the field: This survey serves as a foundational resource for researchers by organizing current knowledge and highlighting promising research directions. It supports ongoing efforts in MM-LLMs by maintaining a real-time tracking website for the latest developments, potentially accelerating innovation and application in the field."}]}
                // if (!response.ok) {
                //     const errorText = await response.text();
                //     console.error(`Network response was not ok: ${errorText}`);
                //     return;
                // }

                setData(response);
            } catch (error) {
                // console.error("Error fetching data:", error);
                // setError('Failed to fetch data');
                // setData({ results: [] });
            } finally {
                setLoading(false);
            }
        };

        if (shouldFetch) {
            fetchData();
        }
    }, [searchTerm, shouldFetch]);

    return { data: data.results, loading, error };
};
